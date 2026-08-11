namespace SocialMediaAdminBackend.Models.DTOs.Request;

public class AdminFilterRequest
{
    public string? Search { get; set; }
    public string? Role { get; set; }
    public bool? IsActive { get; set; }
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; }
    public int Page { get; set; } = 0;
    public int Size { get; set; } = 20;
}