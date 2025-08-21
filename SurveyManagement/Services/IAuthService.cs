using SurveyManagement.Models;

namespace SurveyManagement.Services
{
    public interface IAuthService
    {
        TokenResponse Login(string email, string password);
        TokenResponse RefreshToken(string refreshToken);
        bool RevokeRefreshToken(string refreshToken);
        bool ValidateRefreshToken(string refreshToken);
        bool ChangePassword(int userId, string currentPassword, string newPassword);
    }
}
