using SurveyManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace SurveyManagement.Services
{
    public class UserService : IUserService
    {
        private readonly EmployeeSurveyDbContext _context;

        public UserService(EmployeeSurveyDbContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAll()
        {
            try
            {
                Console.WriteLine("UserService.GetAll: Starting...");
                Console.WriteLine($"UserService.GetAll: Context is null: {_context == null}");
                
                var users = _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.Department)
                    // Ưu tiên Admin (RoleId == 1) lên đầu, sau đó sort theo UserId
                    .OrderBy(u => u.RoleId == 1 ? 0 : 1)
                    .ThenBy(u => u.UserId)
                    .ToList();
                
                Console.WriteLine($"UserService.GetAll: Found {users.Count} users");
                return users;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UserService.GetAll Error: {ex.Message}");
                Console.WriteLine($"UserService.GetAll Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"UserService.GetAll Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }

        public User? GetById(int id)
        {
            return _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .FirstOrDefault(u => u.UserId == id);
        }

        public User? GetByEmail(string email)
        {
            return _context.Users
                .Include(u => u.Role)
                .Include(u => u.Department)
                .FirstOrDefault(u => u.Email == email);
        }

        public User Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public User Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
            return user;
        }

        public bool Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            _context.SaveChanges();
            return true;
        }
    }
}
