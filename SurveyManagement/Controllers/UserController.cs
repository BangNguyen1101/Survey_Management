using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SurveyManagement.Models;
using SurveyManagement.Services;
using Microsoft.Extensions.DependencyInjection; // Added for HttpContext.RequestServices
using SurveyManagement.Data; // Added for EmployeeSurveyDbContext
using Microsoft.EntityFrameworkCore; // Added for Include

namespace SurveyManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("test")]
        [AllowAnonymous] // Test endpoint không cần auth
        public IActionResult Test()
        {
            try
            {
                Console.WriteLine("UserController.Test: Starting test...");
                
                // Test database connection
                var userCount = _userService.GetAll().Count();
                Console.WriteLine($"UserController.Test: Found {userCount} users");
                
                return Ok(new { 
                    message = "User controller is working", 
                    databaseConnected = true,
                    userCount = userCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UserController.Test Error: {ex.Message}");
                Console.WriteLine($"UserController.Test Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"UserController.Test Inner exception: {ex.InnerException.Message}");
                }
                
                return StatusCode(500, new { 
                    message = "Database connection failed", 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpGet("test-db")]
        [AllowAnonymous] // Test endpoint không cần auth
        public IActionResult TestDatabase()
        {
            try
            {
                Console.WriteLine("UserController.TestDatabase: Starting database test...");
                
                // Test database connection trực tiếp
                var context = HttpContext.RequestServices.GetRequiredService<EmployeeSurveyDbContext>();
                Console.WriteLine("UserController.TestDatabase: DbContext created");
                
                var userCount = context.Users.Count();
                Console.WriteLine($"UserController.TestDatabase: Found {userCount} users in database");
                
                return Ok(new { 
                    message = "Database connection test successful", 
                    databaseConnected = true,
                    userCount = userCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UserController.TestDatabase Error: {ex.Message}");
                Console.WriteLine($"UserController.TestDatabase Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"UserController.TestDatabase Inner exception: {ex.InnerException.Message}");
                }
                
                return StatusCode(500, new { 
                    message = "Database connection test failed", 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpGet("test-seed")]
        [AllowAnonymous] // Test endpoint không cần auth
        public IActionResult TestSeed()
        {
            try
            {
                Console.WriteLine("UserController.TestSeed: Starting seed test...");
                
                // Test seeding database
                var context = HttpContext.RequestServices.GetRequiredService<EmployeeSurveyDbContext>();
                Console.WriteLine("UserController.TestSeed: DbContext created");
                
                // Kiểm tra roles
                var roleCount = context.Roles.Count();
                Console.WriteLine($"UserController.TestSeed: Found {roleCount} roles");
                
                // Kiểm tra departments
                var deptCount = context.Departments.Count();
                Console.WriteLine($"UserController.TestSeed: Found {deptCount} departments");
                
                // Kiểm tra users
                var userCount = context.Users.Count();
                Console.WriteLine($"UserController.TestSeed: Found {userCount} users");
                
                return Ok(new { 
                    message = "Seed test successful", 
                    roles = roleCount,
                    departments = deptCount,
                    users = userCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UserController.TestSeed Error: {ex.Message}");
                Console.WriteLine($"UserController.TestSeed Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"UserController.TestSeed Inner exception: {ex.InnerException.Message}");
                }
                
                return StatusCode(500, new { 
                    message = "Seed test failed", 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpGet("test-include")]
        [AllowAnonymous] // Test endpoint không cần auth
        public IActionResult TestInclude()
        {
            try
            {
                Console.WriteLine("UserController.TestInclude: Starting include test...");
                
                // Test Include trực tiếp
                var context = HttpContext.RequestServices.GetRequiredService<EmployeeSurveyDbContext>();
                Console.WriteLine("UserController.TestInclude: DbContext created");
                
                // Test không có Include
                var usersWithoutInclude = context.Users.ToList();
                Console.WriteLine($"UserController.TestInclude: Found {usersWithoutInclude.Count} users without include");
                
                // Test với Include
                var usersWithInclude = context.Users
                    .Include(u => u.Role)
                    .Include(u => u.Department)
                    .ToList();
                Console.WriteLine($"UserController.TestInclude: Found {usersWithInclude.Count} users with include");
                
                return Ok(new { 
                    message = "Include test successful", 
                    usersWithoutInclude = usersWithoutInclude.Count,
                    usersWithInclude = usersWithInclude.Count,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UserController.TestInclude Error: {ex.Message}");
                Console.WriteLine($"UserController.TestInclude Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"UserController.TestInclude Inner exception: {ex.InnerException.Message}");
                }
                
                return StatusCode(500, new { 
                    message = "Include test failed", 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpGet]
        [AllowAnonymous] // Tạm thời bỏ auth để test
        public IActionResult GetAll()
        {
            try
            {
                Console.WriteLine("Starting GetAll users...");
                var users = _userService.GetAll();
                Console.WriteLine($"Found {users.Count()} users");

                // Trả về dữ liệu phẳng để tránh vòng tham chiếu khi serialize (Role.Users, Department.Users)
                var result = users.Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Email,
                    u.RoleId,
                    u.Level,
                    u.DepartmentId
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAll: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { 
                    message = "Lỗi khi lấy danh sách người dùng", 
                    error = ex.Message,
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("{id}")]
        [Authorize] // Cần token
        public IActionResult GetById(int id)
        {
            var user = _userService.GetById(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới tạo user
        public IActionResult Create([FromBody] CreateUserRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "User data is required" });

            if (string.IsNullOrWhiteSpace(request.FullName))
                return BadRequest(new { message = "Họ tên là bắt buộc" });

            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email là bắt buộc" });

            // Kiểm tra email đã tồn tại
            var existingUser = _userService.GetByEmail(request.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email đã tồn tại" });

            // Kiểm tra password
            if (string.IsNullOrEmpty(request.Password) || request.Password.Length < 6)
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự" });

            var newUser = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password,
                RoleId = request.RoleId,
                Level = request.Level,
                DepartmentId = request.DepartmentId
            };

            var createdUser = _userService.Add(newUser);
            return CreatedAtAction(nameof(GetById), new { id = createdUser.UserId }, createdUser);
        }

        [HttpPut("{id}")]
        [Authorize] // Cần token
        public IActionResult Update(int id, [FromBody] CreateUserRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Invalid user data" });

            var existingUser = _userService.GetById(id);
            if (existingUser == null)
                return NotFound(new { message = "User not found" });

            // Kiểm tra email đã tồn tại (trừ user hiện tại)
            var duplicateEmail = _userService.GetByEmail(request.Email);
            if (duplicateEmail != null && duplicateEmail.UserId != id)
                return BadRequest(new { message = "Email đã tồn tại" });

            // Xử lý password: nếu để trống thì giữ nguyên, nếu có thì validate độ dài
            if (!string.IsNullOrEmpty(request.Password) && request.Password.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự" });
            }

            existingUser.FullName = request.FullName;
            existingUser.Email = request.Email;
            existingUser.RoleId = request.RoleId;
            existingUser.Level = request.Level;
            existingUser.DepartmentId = request.DepartmentId;
            if (!string.IsNullOrEmpty(request.Password))
            {
                existingUser.Password = request.Password;
            }

            var updatedUser = _userService.Update(existingUser);
            return Ok(updatedUser);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới xóa user
        public IActionResult Delete(int id)
        {
            var user = _userService.GetById(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            var success = _userService.Delete(id);
            if (!success)
                return BadRequest(new { message = "Failed to delete user" });

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpGet("me")]
        [Authorize] // Cần token
        public IActionResult GetCurrentUser()
        {
            // Lấy thông tin user hiện tại từ token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { message = "Invalid token" });

            var user = _userService.GetById(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }
    }
}
