using System;
using System.Collections.Generic;

namespace SurveyManagement.Models;

public partial class Question
{
    public int QuestionId { get; set; }

    public int TestId { get; set; }

    public string Content { get; set; } = null!;

    public string? Type { get; set; }

    public string? Skill { get; set; }

    public string? Difficulty { get; set; }

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public virtual Test Test { get; set; } = null!;

    public virtual ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
}
