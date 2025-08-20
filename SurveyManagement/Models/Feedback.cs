using System;
using System.Collections.Generic;

namespace SurveyManagement.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int UserId { get; set; }

    public int TestId { get; set; }

    public string? Content { get; set; }

    public DateTime? Date { get; set; }

    public virtual Test Test { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
