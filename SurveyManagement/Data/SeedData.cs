using Microsoft.EntityFrameworkCore;
using SurveyManagement.Models;

namespace SurveyManagement.Data
{
    public static class SeedData
    {
        public static void SeedDatabase(EmployeeSurveyDbContext context)
        {
            try
            {
                Console.WriteLine("SeedData: Starting database seeding...");
                
                // Seed Roles
                if (!context.Roles.Any())
                {
                    Console.WriteLine("SeedData: Seeding roles...");
                    var roles = new List<Role>
                    {
                        new Role { RoleName = "Admin" },
                        new Role { RoleName = "User" },
                        new Role { RoleName = "HR" },
                        new Role { RoleName = "Manager" }
                    };
                    context.Roles.AddRange(roles);
                    context.SaveChanges();
                    Console.WriteLine("SeedData: Roles seeded successfully");
                }
                else
                {
                    Console.WriteLine("SeedData: Roles already exist");
                }

                // Seed Departments
                if (!context.Departments.Any())
                {
                    Console.WriteLine("SeedData: Seeding departments...");
                    var departments = new List<Department>
                    {
                        new Department { DepartmentName = "IT" },
                        new Department { DepartmentName = "HR" },
                        new Department { DepartmentName = "Marketing" },
                        new Department { DepartmentName = "Sales" },
                        new Department { DepartmentName = "Finance" },
                        new Department { DepartmentName = "Operations" }
                    };
                    context.Departments.AddRange(departments);
                    context.SaveChanges();
                    Console.WriteLine("SeedData: Departments seeded successfully");
                }
                else
                {
                    Console.WriteLine("SeedData: Departments already exist");
                }

                // Đảm bảo luôn có tài khoản Admin với UserId = 1
                try
                {
                    var adminRole = context.Roles.FirstOrDefault(r => r.RoleName == "Admin");
                    if (adminRole == null)
                    {
                        Console.WriteLine("SeedData: Cannot ensure Admin id=1 because Role 'Admin' not found.");
                    }
                    else
                    {
                        var itDepartment = context.Departments.FirstOrDefault(d => d.DepartmentName == "IT");

                        // Nếu đã có bản ghi Id=1 nhưng không phải Admin, bỏ qua, chỉ đảm bảo có Admin ở Id=1 khi trống
                        var hasId1 = context.Users.Any(u => u.UserId == 1);
                        var adminUser = context.Users.FirstOrDefault(u => u.RoleId == adminRole.RoleId);
                        var adminEmail = "admin@gmail.com";

                        if (!hasId1)
                        {
                            using var tx = context.Database.BeginTransaction();
                            Console.WriteLine("SeedData: Ensuring Admin with UserId = 1 (no current id=1 user)...");

                            if (adminUser == null)
                            {
                                // Chưa có Admin nào -> tạo mới với Id=1
                                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [User] ON");
                                context.Users.Add(new User
                                {
                                    UserId = 1,
                                    FullName = "ADMIN",
                                    Email = adminEmail,
                                    Password = "11012004",
                                    RoleId = adminRole.RoleId,
                                    DepartmentId = itDepartment?.DepartmentId,
                                    Level = null
                                });
                                context.SaveChanges();
                                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [User] OFF");
                                Console.WriteLine("SeedData: Inserted Admin with UserId = 1");
                            }
                            else
                            {
                                // Đã có Admin với UserId khác 1 -> di chuyển sang Id=1 an toàn
                                var oldId = adminUser.UserId;
                                var tempEmail = $"{adminUser.Email}.old.{Guid.NewGuid()}";

                                // 1) Tạm đổi email cũ để tránh unique key conflict
                                context.Database.ExecuteSqlRaw(
                                    "UPDATE [User] SET [Email] = {0} WHERE [UserId] = {1}", tempEmail, oldId);

                                // 2) Chèn bản ghi mới với UserId = 1
                                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [User] ON");
                                context.Database.ExecuteSqlRaw(
                                    "INSERT INTO [User] ([UserId],[FullName],[Email],[Password],[RoleId],[Level],[DepartmentId]) VALUES (1, {0}, {1}, {2}, {3}, {4}, {5})",
                                    adminUser.FullName ?? "ADMIN",
                                    adminEmail,
                                    adminUser.Password ?? "11012004",
                                    adminRole.RoleId,
                                    (object?)adminUser.Level ?? (object?)DBNull.Value,
                                    (object?)adminUser.DepartmentId ?? (object?)DBNull.Value
                                );
                                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [User] OFF");

                                // 3) Cập nhật các bảng FK trỏ về Admin mới (Id=1)
                                context.Database.ExecuteSqlRaw("UPDATE [Badge] SET [UserId] = 1 WHERE [UserId] = {0}", oldId);
                                context.Database.ExecuteSqlRaw("UPDATE [Feedback] SET [UserId] = 1 WHERE [UserId] = {0}", oldId);
                                context.Database.ExecuteSqlRaw("UPDATE [UserTest] SET [UserId] = 1 WHERE [UserId] = {0}", oldId);
                                context.Database.ExecuteSqlRaw("UPDATE [RefreshToken] SET [UserId] = 1 WHERE [UserId] = {0}", oldId);

                                // 4) Xóa bản ghi Admin cũ
                                context.Database.ExecuteSqlRaw("DELETE FROM [User] WHERE [UserId] = {0}", oldId);

                                Console.WriteLine($"SeedData: Moved Admin from UserId={oldId} to UserId=1");
                            }

                            // Reseed identity để tiếp tục tăng từ MAX(UserId)
                            context.Database.ExecuteSqlRaw(
                                "DECLARE @mx INT; SELECT @mx = MAX([UserId]) FROM [User]; DBCC CHECKIDENT ('[User]', RESEED, @mx);");
                            tx.Commit();
                        }
                        else
                        {
                            Console.WriteLine("SeedData: UserId = 1 already exists. Skipping ensure step.");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"SeedData: Error ensuring Admin Id=1: {ex.Message}");
                }

                // Seed Tests
                if (!context.Tests.Any())
                {
                    Console.WriteLine("SeedData: Seeding tests...");
                    var tests = new List<Test>
                    {
                        new Test 
                        { 
                            Title = "General Knowledge Test",
                            Description = "A general knowledge test for all employees",
                            TimeLimit = 60,
                            PassScore = 70
                        },
                        new Test 
                        { 
                            Title = "Technical Skills Assessment",
                            Description = "Assessment of technical skills and knowledge",
                            TimeLimit = 90,
                            PassScore = 80
                        }
                    };
                    context.Tests.AddRange(tests);
                    context.SaveChanges();
                    Console.WriteLine("SeedData: Tests seeded successfully");
                }
                else
                {
                    Console.WriteLine("SeedData: Tests already exist");
                }

                // Seed thêm người dùng mẫu khác (nếu hiện tại chỉ có Admin id=1 hoặc chưa có user)
                if (context.Users.Count() <= 1)
                {
                    Console.WriteLine("SeedData: Seeding admin user...");
                    var adminRole = context.Roles.FirstOrDefault(r => r.RoleName == "Admin");
                    var userRole = context.Roles.FirstOrDefault(r => r.RoleName == "User");
                    var hrRole = context.Roles.FirstOrDefault(r => r.RoleName == "HR");
                    var managerRole = context.Roles.FirstOrDefault(r => r.RoleName == "Manager");
                    
                    var itDepartment = context.Departments.FirstOrDefault(d => d.DepartmentName == "IT");
                    var hrDepartment = context.Departments.FirstOrDefault(d => d.DepartmentName == "HR");
                    var marketingDepartment = context.Departments.FirstOrDefault(d => d.DepartmentName == "Marketing");
                    var salesDepartment = context.Departments.FirstOrDefault(d => d.DepartmentName == "Sales");
                    
                    if (adminRole != null)
                    {
                        var users = new List<User>
                        {
                            // Không thêm lại Admin để tránh trùng (đã đảm bảo ở bước trên)
                            new User
                            {
                                FullName = "BangNguyen",
                                Email = "bang@gmail.com",
                                Password = "11012004",
                                RoleId = userRole?.RoleId ?? 2,
                                DepartmentId = hrDepartment?.DepartmentId ?? itDepartment?.DepartmentId,
                                Level = "senior"
                            },
                            new User
                            {
                                FullName = "BangNe",
                                Email = "bang@hehe.com",
                                Password = "11012004",
                                RoleId = hrRole?.RoleId ?? 3,
                                DepartmentId = marketingDepartment?.DepartmentId ?? itDepartment?.DepartmentId,
                                Level = "fresher"
                            },
                            new User
                            {
                                FullName = "Bang",
                                Email = "hehe@gmail.com",
                                Password = "11012004",
                                RoleId = managerRole?.RoleId ?? 4,
                                DepartmentId = salesDepartment?.DepartmentId ?? itDepartment?.DepartmentId,
                                Level = "middle"
                            }
                        };
                        context.Users.AddRange(users);
                        context.SaveChanges();
                        Console.WriteLine("SeedData: Admin user seeded successfully");
                    }
                    else
                    {
                        Console.WriteLine("SeedData: Could not find roles or departments for admin user seeding.");
                    }
                }
                else
                {
                    Console.WriteLine("SeedData: Admin user already exists");
                }
                Console.WriteLine("SeedData: Database seeding completed.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SeedData: An error occurred during database seeding: {ex.Message}");
                Console.WriteLine($"SeedData: Stack trace: {ex.StackTrace}");
            }
        }
    }
}

