namespace SurveyManagement.Models
{
    public class CreateUserRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string? Level { get; set; }
        public int? DepartmentId { get; set; }
    }
}


