using Microsoft.EntityFrameworkCore;
using SocialMediaAdminBackend.Data;
using SocialMediaAdminBackend.Models.DTOs.Response;
using SocialMediaAdminBackend.Models.Entities;

namespace SocialMediaAdminBackend.Repositories;

public class UserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    // Existing methods...

    public async Task<List<User>> GetBannedUsersAsync()
    {
        // Assuming you're using IsActive flag for soft delete/ban
        return await _context.Users
            .Where(u => !u.IsActive)
            .OrderByDescending(u => u.UpdatedAt)
            .ToListAsync();
    }

    public async Task<PaginatedResponse<AdminUserResponse>> GetBannedUsersPaginatedAsync(int page, int size)
    {
        var query = _context.Users.Where(u => !u.IsActive);

        var totalElements = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalElements / size);

        var users = await query
            .OrderByDescending(u => u.UpdatedAt)
            .Skip(page * size)
            .Take(size)
            .ToListAsync();

        return new PaginatedResponse<AdminUserResponse>
        {
            Content = users.Select(MapToAdminUserResponse).ToList(),
            PageNumber = page,
            PageSize = size,
            TotalElements = totalElements,
            TotalPages = totalPages,
            IsLast = page >= totalPages - 1
        };
    }

    public async Task<PaginatedResponse<AdminUserResponse>> SearchUsersAsync(
        string query, int page, int size, string? role = null)
    {
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

        return new PaginatedResponse<AdminUserResponse>
        {
            Content = users.Select(MapToAdminUserResponse).ToList(),
            PageNumber = page,
            PageSize = size,
            TotalElements = totalElements,
            TotalPages = totalPages,
            IsLast = page >= totalPages - 1
        };
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