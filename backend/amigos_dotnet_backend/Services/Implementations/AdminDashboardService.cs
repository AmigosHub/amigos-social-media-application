using Microsoft.EntityFrameworkCore;
using SocialMediaAdminBackend.Data;
using SocialMediaAdminBackend.Models.DTOs.Response;
using SocialMediaAdminBackend.Services.Interfaces;
using System.Text.Json;

namespace SocialMediaAdminBackend.Services.Implementations;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AdminDashboardService> _logger;

    public AdminDashboardService(
        ApplicationDbContext context,
        ILogger<AdminDashboardService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<AdminDashboardStats> GetDashboardStatsAsync()
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var weekAgo = today.AddDays(-7);
            var monthAgo = today.AddMonths(-1);

            var stats = new AdminDashboardStats();

            // User Stats
            stats.Users.TotalUsers = await _context.Users.CountAsync();
            stats.Users.ActiveUsers = await _context.Users.CountAsync(u => u.IsActive);
            stats.Users.InactiveUsers = stats.Users.TotalUsers - stats.Users.ActiveUsers;

            // Banned users - if you have a banned table
            stats.Users.BannedUsers = 0; // You can implement this later

            stats.Users.NewUsersToday = await _context.Users
                .CountAsync(u => u.CreatedAt.Date == today);
            stats.Users.NewUsersThisWeek = await _context.Users
                .CountAsync(u => u.CreatedAt >= weekAgo);
            stats.Users.NewUsersThisMonth = await _context.Users
                .CountAsync(u => u.CreatedAt >= monthAgo);

            // Post Stats
            stats.Posts.TotalPosts = await _context.Posts.CountAsync();
            stats.Posts.NewPostsToday = await _context.Posts
                .CountAsync(p => p.CreatedAt.Date == today);
            stats.Posts.NewPostsThisWeek = await _context.Posts
                .CountAsync(p => p.CreatedAt >= weekAgo);
            stats.Posts.NewPostsThisMonth = await _context.Posts
                .CountAsync(p => p.CreatedAt >= monthAgo);

            // Interaction Stats
            stats.Interactions.TotalComments = await _context.Comments.CountAsync();
            stats.Interactions.TotalLikes = await _context.Likes.CountAsync();
            stats.Interactions.NewCommentsToday = await _context.Comments
                .CountAsync(c => c.CreatedAt.Date == today);
            stats.Interactions.NewLikesToday = await _context.Likes
                .CountAsync(l => l.CreatedAt.Date == today);

            // Report Stats
            stats.Reports.TotalReports = await _context.Reports.CountAsync();
            stats.Reports.PendingReports = await _context.Reports
                .CountAsync(r => r.Status == "PENDING");
            stats.Reports.ResolvedReports = await _context.Reports
                .CountAsync(r => r.Status == "RESOLVED");
            stats.Reports.DismissedReports = await _context.Reports
                .CountAsync(r => r.Status == "DISMISSED");
            stats.Reports.NewReportsToday = await _context.Reports
                .CountAsync(r => r.CreatedAt.Date == today);

            // Chat Stats
            stats.Chat.TotalMessages = await _context.Messages.CountAsync();
            stats.Chat.TotalConversations = await _context.Conversations.CountAsync();
            stats.Chat.ActiveConversations = await _context.Conversations
                .CountAsync(c => c.LastMessageAt >= weekAgo);
            stats.Chat.NewMessagesToday = await _context.Messages
                .CountAsync(m => m.CreatedAt.Date == today);

            // Calculate growth percentages
            var previousMonthUsers = await _context.Users
                .CountAsync(u => u.CreatedAt < monthAgo);
            stats.Users.UserGrowthPercentage = previousMonthUsers > 0
                ? ((double)(stats.Users.TotalUsers - previousMonthUsers) / previousMonthUsers) * 100
                : 0;

            var previousMonthPosts = await _context.Posts
                .CountAsync(p => p.CreatedAt < monthAgo);
            stats.Posts.PostGrowthPercentage = previousMonthPosts > 0
                ? ((double)(stats.Posts.TotalPosts - previousMonthPosts) / previousMonthPosts) * 100
                : 0;

            // Average calculations
            stats.Interactions.AverageLikesPerPost = stats.Posts.TotalPosts > 0
                ? (double)stats.Interactions.TotalLikes / stats.Posts.TotalPosts
                : 0;
            stats.Interactions.AverageCommentsPerPost = stats.Posts.TotalPosts > 0
                ? (double)stats.Interactions.TotalComments / stats.Posts.TotalPosts
                : 0;

            return stats;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching dashboard stats");
            return new AdminDashboardStats();
        }
    }

    public async Task<List<DailyActivityStats>> GetDailyActivityAsync(DateTime startDate, DateTime endDate)
    {
        try
        {
            var result = new List<DailyActivityStats>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var nextDay = date.AddDays(1);

                var stats = new DailyActivityStats
                {
                    Date = date,
                    NewPosts = await _context.Posts
                        .CountAsync(p => p.CreatedAt >= date && p.CreatedAt < nextDay),
                    NewComments = await _context.Comments
                        .CountAsync(c => c.CreatedAt >= date && c.CreatedAt < nextDay),
                    NewLikes = await _context.Likes
                        .CountAsync(l => l.CreatedAt >= date && l.CreatedAt < nextDay),
                    NewMessages = await _context.Messages
                        .CountAsync(m => m.CreatedAt >= date && m.CreatedAt < nextDay),
                    NewUsers = await _context.Users
                        .CountAsync(u => u.CreatedAt >= date && u.CreatedAt < nextDay)
                };

                result.Add(stats);
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching daily activity");
            return new List<DailyActivityStats>();
        }
    }

    public async Task<List<DailyUserStats>> GetUserGrowthAsync(DateTime startDate, DateTime endDate)
    {
        try
        {
            var result = new List<DailyUserStats>();
            long cumulativeUsers = 0;

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var nextDay = date.AddDays(1);
                var dailyNewUsers = await _context.Users
                    .CountAsync(u => u.CreatedAt >= date && u.CreatedAt < nextDay);

                cumulativeUsers += dailyNewUsers;

                var stats = new DailyUserStats
                {
                    Date = date,
                    TotalUsers = cumulativeUsers,
                    ActiveUsers = await _context.Users
                        .CountAsync(u => u.IsActive && u.CreatedAt < nextDay),
                    NewUsers = dailyNewUsers
                };

                result.Add(stats);
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user growth");
            return new List<DailyUserStats>();
        }
    }
}