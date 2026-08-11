using SocialMediaAdminBackend.Models.DTOs.Response;

namespace SocialMediaAdminBackend.Models.DTOs.Response;

public class AdminPostResponse
{
    public long Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string MediaUrl { get; set; } = string.Empty;
    public string MediaType { get; set; } = string.Empty;
    public AdminUserResponse User { get; set; } = new();
    public long LikesCount { get; set; }
    public long CommentsCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public bool IsReported { get; set; }
    public List<AdminReportResponse> Reports { get; set; } = new();
}