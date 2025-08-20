using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SurveyManagement.Models;
using SurveyManagement.Services;

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
                // Test database connection
                var userCount = _userService.GetAll().Count();
                return Ok(new { 
                    message = "User controller is working", 
                    databaseConnected = true,
                    userCount = userCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Database connection failed", 
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới xem được danh sách user
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            return Ok(users);
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
        public IActionResult Create([FromBody] User user)
        {
            if (user == null)
                return BadRequest(new { message = "User data is required" });

            var createdUser = _userService.Add(user);
            return CreatedAtAction(nameof(GetById), new { id = createdUser.UserId }, createdUser);
        }

        [HttpPut("{id}")]
        [Authorize] // Cần token
        public IActionResult Update(int id, [FromBody] User user)
        {
            if (user == null || id != user.UserId)
                return BadRequest(new { message = "Invalid user data" });

            var existingUser = _userService.GetById(id);
            if (existingUser == null)
                return NotFound(new { message = "User not found" });

            var updatedUser = _userService.Update(user);
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
