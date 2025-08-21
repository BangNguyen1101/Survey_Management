using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SurveyManagement.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SurveyManagement.Services
{
    public class AuthService : IAuthService
    {
        private readonly EmployeeSurveyDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(EmployeeSurveyDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public TokenResponse Login(string email, string password)
        {
            var user = _context.Users
                .Include(u => u.Role)
                .FirstOrDefault(u => u.Email == email && u.Password == password);

            if (user == null) return null!;

            // Lấy roleName an toàn
            var roleName = user.Role?.RoleName
                ?? _context.Set<Role>()
                    .Where(r => r.RoleId == user.RoleId)
                    .Select(r => r.RoleName)
                    .FirstOrDefault()
                ?? "User";

            var accessToken = GenerateAccessToken(user, roleName);
            var refreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"]));

            // Lưu refresh token vào DB
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.UserId,
                ExpiresAt = DateTime.UtcNow.AddDays(7), // Refresh token có hạn 7 ngày
                IsRevoked = false
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            _context.SaveChanges();

            return new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt,
                TokenType = "Bearer"
            };
        }

        public TokenResponse RefreshToken(string refreshToken)
        {
            var refreshTokenEntity = _context.RefreshTokens
                .Include(rt => rt.User)
                .ThenInclude(u => u.Role)
                .FirstOrDefault(rt => rt.Token == refreshToken && !rt.IsRevoked);

            if (refreshTokenEntity == null || refreshTokenEntity.ExpiresAt < DateTime.UtcNow)
                return null!;

            var user = refreshTokenEntity.User;
            var roleName = user.Role?.RoleName ?? "User";

            var newAccessToken = GenerateAccessToken(user, roleName);
            var newRefreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"]));

            // Revoke refresh token cũ
            refreshTokenEntity.IsRevoked = true;

            // Tạo refresh token mới
            var newRefreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                UserId = user.UserId,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            _context.RefreshTokens.Add(newRefreshTokenEntity);
            _context.SaveChanges();

            return new TokenResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = expiresAt,
                TokenType = "Bearer"
            };
        }

        public bool RevokeRefreshToken(string refreshToken)
        {
            var refreshTokenEntity = _context.RefreshTokens
                .FirstOrDefault(rt => rt.Token == refreshToken && !rt.IsRevoked);

            if (refreshTokenEntity == null) return false;

            refreshTokenEntity.IsRevoked = true;
            _context.SaveChanges();
            return true;
        }

        public bool ValidateRefreshToken(string refreshToken)
        {
            var refreshTokenEntity = _context.RefreshTokens
                .FirstOrDefault(rt => rt.Token == refreshToken && !rt.IsRevoked);

            return refreshTokenEntity != null && refreshTokenEntity.ExpiresAt > DateTime.UtcNow;
        }

        private string GenerateAccessToken(User user, string roleName)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, roleName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
        
        public bool ChangePassword(int userId, string currentPassword, string newPassword)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId && u.Password == currentPassword);
            
            if (user == null) return false;
            
            user.Password = newPassword;
            _context.SaveChanges();
            
            return true;
        }
    }
}
