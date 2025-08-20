using System;
using System.Collections.Generic;

namespace SurveyManagement.Models;

public partial class Badge
{
    public int BadgeId { get; set; }

    public int UserId { get; set; }

    public string? BadgeName { get; set; }

    public int? Score { get; set; }

    public virtual User User { get; set; } = null!;
}
