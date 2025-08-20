using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SurveyManagement.Models;
using SurveyManagement.Services;

namespace SurveyManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var tokenResponse = _authService.Login(request.Email, request.Password);
            if (tokenResponse == null)
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(tokenResponse);
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            // Kiểm tra email đã tồn tại chưa
            var existingUser = _userService.GetByEmail(request.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already exists" });

            // Tạo user mới (mặc định role = User)
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password, // TODO: Hash password
                RoleId = 2, // Giả sử RoleId = 2 là "User"
                Level = request.Level,
                DepartmentId = request.DepartmentId
            };

            var createdUser = _userService.Add(user);
            
            // Tạo token cho user vừa đăng ký
            var tokenResponse = _authService.Login(request.Email, request.Password);
            
            return Ok(new { 
                message = "User registered successfully",
                accessToken = tokenResponse.AccessToken,
                refreshToken = tokenResponse.RefreshToken,
                expiresAt = tokenResponse.ExpiresAt,
                user = new
                {
                    createdUser.UserId,
                    createdUser.FullName,
                    createdUser.Email,
                    createdUser.RoleId
                }
            });
        }

        [HttpPost("refresh")]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var tokenResponse = _authService.RefreshToken(request.RefreshToken);
            if (tokenResponse == null)
                return Unauthorized(new { message = "Invalid or expired refresh token" });

            return Ok(tokenResponse);
        }

        [HttpPost("revoke")]
        [Authorize]
        public IActionResult RevokeToken([FromBody] RefreshTokenRequest request)
        {
            var success = _authService.RevokeRefreshToken(request.RefreshToken);
            if (!success)
                return BadRequest(new { message = "Invalid refresh token" });

            return Ok(new { message = "Token revoked successfully" });
        }

        [HttpGet("profile")]
        [Authorize]
        public IActionResult GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                UserId = userId,
                Email = email,
                Role = role
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout([FromBody] RefreshTokenRequest request)
        {
            // Revoke refresh token
            _authService.RevokeRefreshToken(request.RefreshToken);
            
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("validate-token")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            return Ok(new { message = "Token is valid" });
        }
    }
}
