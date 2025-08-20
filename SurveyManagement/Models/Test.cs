using System;
using System.Collections.Generic;

namespace SurveyManagement.Models;

public partial class Test
{
    public int TestId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int? TimeLimit { get; set; }

    public int? PassScore { get; set; }

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    public virtual ICollection<UserTest> UserTests { get; set; } = new List<UserTest>();
}
