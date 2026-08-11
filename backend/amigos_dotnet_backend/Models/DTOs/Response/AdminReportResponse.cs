using SocialMediaAdminBackend.Models.DTOs.Response;

namespace SocialMediaAdminBackend.Models.DTOs.Response;

public class AdminReportResponse
{
    public long Id { get; set; }
    public AdminUserResponse Reporter { get; set; } = new();
    public AdminUserResponse? ReportedUser { get; set; }
    public AdminPostResponse? ReportedPost { get; set; }
    public AdminCommentResponse? ReportedComment { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public AdminUserResponse? ResolvedBy { get; set; }
}

