using System;
using System.Collections.Generic;

namespace SurveyManagement.Models;

public partial class VUserInfo
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string RoleName { get; set; } = null!;

    public string? DepartmentName { get; set; }

    public string? Level { get; set; }
}
