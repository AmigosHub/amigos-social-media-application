
using Microsoft.EntityFrameworkCore;
using SocialMediaAdminBackend.Data;
using SocialMediaAdminBackend.Models.DTOs.Response;
using SocialMediaAdminBackend.Models.Entities;
using SocialMediaAdminBackend.Services.Interfaces;

namespace SocialMediaAdminBackend.Services.Implementations;

public class AdminUserService : IAdminUserService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AdminUserService> _logger;

    public AdminUserService(
        ApplicationDbContext context,
        ILogger<AdminUserService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PaginatedResponse<AdminUserResponse>> GetUsersAsync(
        int page, int size, string? search = null, string? role = null, bool? isActive = null)
    {
        try
        {
            var query = _context.Users.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u =>
                    u.Username.Contains(search) ||
                    u.FullName.Contains(search) ||
                    u.Email.Contains(search));
            }

            if (!string.IsNullOrEmpty(role))
            {
                query = query.Where(u => u.Role == role);
            }

            if (isActive.HasValue)
            {
                query = query.Where(u => u.IsActive == isActive.Value);
            }

            var totalElements = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalElements / size);

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip(page * size)
                .Take(size)
                .ToListAsync();

            var userResponses = users.Select(MapToAdminUserResponse).ToList();

            return new PaginatedResponse<AdminUserResponse>
            {
                Content = userResponses,
                PageNumber = page,
                PageSize = size,
                TotalElements = totalElements,
                TotalPages = totalPages,
                IsLast = page >= totalPages - 1
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users");
            return new PaginatedResponse<AdminUserResponse>();
        }
    }

    public async Task<AdminUserResponse> GetUserByIdAsync(long userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return new AdminUserResponse();

            return MapToAdminUserResponse(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error fetching user {userId}");
            return new AdminUserResponse();
        }
    }

    public async Task<bool> ActivateUserAsync(long userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"User {userId} activated successfully");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error activating user {userId}");
            return false;
        }
    }

    public async Task<bool> DeactivateUserAsync(long userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"User {userId} deactivated successfully");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deactivating user {userId}");
            return false;
        }
    }

    public async Task<bool> BanUserAsync(long userId, string reason, string? duration = null)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"User {userId} banned successfully. Reason: {reason}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error banning user {userId}");
            return false;
        }
    }

    public async Task<bool> UnbanUserAsync(long userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"User {userId} unbanned successfully");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error unbanning user {userId}");
            return false;
        }
    }

    public async Task<bool> DeleteUserAsync(long userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                _logger.LogWarning($"User {userId} not found for deletion");
                return false;
            }

            // Soft delete - just deactivate
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"User {userId} soft-deleted (deactivated) successfully");
            return true;
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, $"Database error deleting user {userId}");
            // Try to deactivate instead
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.IsActive = false;
                    user.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"User {userId} deactivated instead of delete");
                    return true;
                }
            }
            catch (Exception innerEx)
            {
                _logger.LogError(innerEx, $"Failed to deactivate user {userId} after delete failed");
            }
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting user {userId}");
            return false;
        }
    }

    public async Task<PaginatedResponse<AdminUserResponse>> GetBannedUsersAsync(int page, int size)
    {
        try
        {
            var query = _context.Users
                .Where(u => !u.IsActive)
                .OrderByDescending(u => u.UpdatedAt);

            var totalElements = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalElements / size);

            var users = await query
                .Skip(page * size)
                .Take(size)
                .ToListAsync();

            var userResponses = users.Select(MapToAdminUserResponse).ToList();

            return new PaginatedResponse<AdminUserResponse>
            {
                Content = userResponses,
                PageNumber = page,
                PageSize = size,
                TotalElements = totalElements,
                TotalPages = totalPages,
                IsLast = page >= totalPages - 1
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching banned users");
            return new PaginatedResponse<AdminUserResponse>();
        }
    }

    public async Task<PaginatedResponse<AdminUserResponse>> SearchUsersAsync(
        string query, int page, int size, string? role = null)
    {
        try
        {
            if (string.IsNullOrEmpty(query))
                return new PaginatedResponse<AdminUserResponse>();

            var searchQuery = _context.Users
                .Where(u =>
                    u.Username.Contains(query) ||
                    u.FullName.Contains(query) ||
                    u.Email.Contains(query));

            if (!string.IsNullOrEmpty(role))
            {
                searchQuery = searchQuery.Where(u => u.Role == role);
            }

            var totalElements = await searchQuery.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalElements / size);

            var users = await searchQuery
                .OrderByDescending(u => u.CreatedAt)
                .Skip(page * size)
                .Take(size)
                .ToListAsync();

            var userResponses = users.Select(MapToAdminUserResponse).ToList();

            return new PaginatedResponse<AdminUserResponse>
            {
                Content = userResponses,
                PageNumber = page,
                PageSize = size,
                TotalElements = totalElements,
                TotalPages = totalPages,
                IsLast = page >= totalPages - 1
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching users");
            return new PaginatedResponse<AdminUserResponse>();
        }
    }

    private AdminUserResponse MapToAdminUserResponse(User user)
    {
        return new AdminUserResponse
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Bio = user.Bio ?? string.Empty,
            ProfilePic = user.ProfilePic ?? string.Empty,
            Role = user.Role,
            IsActive = user.IsActive,
            IsPrivate = user.IsPrivate,
            LastSeen = user.LastSeen,
            CreatedAt = user.CreatedAt,
            PostsCount = _context.Posts.Count(p => p.UserId == user.Id),
            FollowersCount = _context.Follows.Count(f => f.FollowingId == user.Id && f.Status == "ACCEPTED"),
            FollowingCount = _context.Follows.Count(f => f.FollowerId == user.Id && f.Status == "ACCEPTED"),
            IsBanned = !user.IsActive
        };
    }
}