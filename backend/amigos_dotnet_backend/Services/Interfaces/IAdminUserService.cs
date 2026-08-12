


using SocialMediaAdminBackend.Models.DTOs.Response;

namespace SocialMediaAdminBackend.Services.Interfaces;

public interface IAdminUserService
{
    // Existing methods
    Task<PaginatedResponse<AdminUserResponse>> GetUsersAsync(
        int page, int size, string? search = null, string? role = null, bool? isActive = null);
    Task<AdminUserResponse> GetUserByIdAsync(long userId);
    Task<bool> ActivateUserAsync(long userId);
    Task<bool> DeactivateUserAsync(long userId);
    Task<bool> BanUserAsync(long userId, string reason, string? duration = null);
    Task<bool> UnbanUserAsync(long userId);
    Task<bool> DeleteUserAsync(long userId);

    // New methods
    Task<PaginatedResponse<AdminUserResponse>> GetBannedUsersAsync(int page, int size);
    Task<PaginatedResponse<AdminUserResponse>> SearchUsersAsync(string query, int page, int size, string? role = null);
}