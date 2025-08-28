using System;
using System.Collections.Generic;

namespace SurveyManagement.Models;

public partial class Answer
{
    public int AnswerId { get; set; }

    public int? QuestionId { get; set; }

    public string Content { get; set; } = null!;

    public bool? IsCorrect { get; set; }

    public virtual Question? Question { get; set; }
}
