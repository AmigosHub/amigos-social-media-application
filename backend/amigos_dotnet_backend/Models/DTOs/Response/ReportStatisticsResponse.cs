//namespace SocialMediaAdminBackend.Models.DTOs.Response;

//public class ReportStatisticsResponse
//{
//    public ReportStats Reports { get; set; } = new();
//    public List<ReportByReason> ReportsByReason { get; set; } = new();
//    public List<ReportByStatus> ReportsByStatus { get; set; } = new();
//    public List<ReportTrend> ReportTrend { get; set; } = new();
//}

//public class ReportByReason
//{
//    public string Reason { get; set; } = string.Empty;
//    public long Count { get; set; }
//    public double Percentage { get; set; }
//}

//public class ReportByStatus
//{
//    public string Status { get; set; } = string.Empty;
//    public long Count { get; set; }
//    public double Percentage { get; set; }
//}

//public class ReportTrend
//{
//    public DateTime Date { get; set; }
//    public long NewReports { get; set; }
//    public long ResolvedReports { get; set; }
//}

namespace SocialMediaAdminBackend.Models.DTOs.Response;

public class ReportStatisticsResponse
{
    public ReportStats Reports { get; set; } = new();
    public List<ReportByReason> ReportsByReason { get; set; } = new();
    public List<ReportByStatus> ReportsByStatus { get; set; } = new();
    public List<ReportTrend> ReportTrend { get; set; } = new();
}

public class ReportByReason
{
    public string Reason { get; set; } = string.Empty;
    public long Count { get; set; }
    public double Percentage { get; set; }
}

public class ReportByStatus
{
    public string Status { get; set; } = string.Empty;
    public long Count { get; set; }
    public double Percentage { get; set; }
}

public class ReportTrend
{
    public DateTime Date { get; set; }
    public long NewReports { get; set; }
    public long ResolvedReports { get; set; }  // ✅ Use this name instead of ReviewedReports
}
