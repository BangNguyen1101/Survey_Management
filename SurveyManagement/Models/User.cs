using System;
using System.Collections.Generic;

namespace SurveyManagement.Models;

public partial class User
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int RoleId { get; set; }

    public string? Level { get; set; }

    public int? DepartmentId { get; set; }

    public virtual ICollection<Badge> Badges { get; set; } = new List<Badge>();

    public virtual Department? Department { get; set; }

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<UserTest> UserTests { get; set; } = new List<UserTest>();
}
