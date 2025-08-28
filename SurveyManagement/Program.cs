using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SurveyManagement.Data;
using SurveyManagement.Models;
using SurveyManagement.Services;
using SurveyManagement.Data;

var builder = WebApplication.CreateBuilder(args);

// Kết nối DB
builder.Services.AddDbContext<EmployeeSurveyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<SurveyDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký service
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();

Console.WriteLine("Services registered successfully");

// CORS cho môi trường dev (Swagger/FE local)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
        
        // Thêm event để debug
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully");
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Console.WriteLine($"Challenge: {context.Error}, {context.ErrorDescription}");
                return Task.CompletedTask;
            }
        };
    });

// Thêm Authorization
builder.Services.AddAuthorization();

builder.Services.AddControllers();
// Cấu hình JSON để tránh lỗi vòng tham chiếu
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Dùng Swagger (OpenAPI)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Survey Management API",
        Version = "v1"
    });
    
    // Thêm JWT authentication vào Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Apply migrations and seed database
try
{
    Console.WriteLine("Starting database migration and seeding...");
    using (var scope = app.Services.CreateScope())
    {
        Console.WriteLine("Creating service scope...");
        var context = scope.ServiceProvider.GetRequiredService<EmployeeSurveyDbContext>();
        Console.WriteLine("DbContext created successfully");
        
        // Apply pending migrations to ensure tables exist
        Console.WriteLine("Applying database migrations...");
        context.Database.Migrate();
        Console.WriteLine("Database migrations applied successfully");
        
        Console.WriteLine("Starting SeedDatabase...");
        SeedData.SeedDatabase(context);
        Console.WriteLine("Database seeded successfully");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Error migrating/seeding database: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
    if (ex.InnerException != null)
    {
        Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
    }
    // Không crash app nếu seed data thất bại
}

app.UseSwagger(c =>
{
    // Đặt server theo scheme/host hiện tại để tránh lỗi mixed content (http -> https)
    c.PreSerializeFilters.Add((swagger, httpReq) =>
    {
        swagger.Servers = new List<OpenApiServer>
        {
            new OpenApiServer { Url = $"{httpReq.Scheme}://{httpReq.Host.Value}" }
        };
    });
});
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Survey Management API v1");
    c.RoutePrefix = string.Empty; // Mặc định mở swagger tại root "/"
});

// Log all requests
app.Use(async (context, next) =>
{
    Console.WriteLine($"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {context.Request.Method} {context.Request.Path}");
    await next();
});

app.UseCors("AllowAll");

// Chỉ redirect HTTPS trong production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Thêm Authentication middleware trước Authorization
app.UseAuthentication(); // Tạm thời comment để test
app.UseAuthorization(); // Tạm thời comment để test

app.MapControllers();

app.Run();
