namespace SocialMediaAdminBackend.Models.DTOs.Response;

public class BanResponse
{
    public long Id { get; set; }
    public AdminUserResponse User { get; set; } = new();
    public AdminUserResponse? Admin { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string BanType { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}