namespace SocialMediaAdminBackend.Models.DTOs.Request;

public class AdminActionRequest
{
    public string Action { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public string? Duration { get; set; }
}