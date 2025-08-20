using SurveyManagement.Models;

namespace SurveyManagement.Services
{
    public interface IUserService
    {
        IEnumerable<User> GetAll();
        User? GetById(int id);
        User? GetByEmail(string email);
        User Add(User user);
        User Update(User user);
        bool Delete(int id);
    }
}
