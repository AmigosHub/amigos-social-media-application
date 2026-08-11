using SocialMediaAdminBackend.Models.DTOs.Response;

namespace SocialMediaAdminBackend.Models.DTOs.Response;

public class AdminCommentResponse
{
    public long Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public AdminUserResponse User { get; set; } = new();
    public AdminPostResponse Post { get; set; } = new();
    public long? ParentId { get; set; }
    public bool IsEdited { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public long LikesCount { get; set; }
    public long RepliesCount { get; set; }
    public List<AdminCommentResponse> Replies { get; set; } = new();
}