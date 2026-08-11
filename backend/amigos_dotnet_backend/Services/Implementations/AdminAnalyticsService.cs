using Microsoft.EntityFrameworkCore;
using SocialMediaAdminBackend.Data;
using SocialMediaAdminBackend.Models.DTOs.Response;
using SocialMediaAdminBackend.Services.Interfaces;

namespace SocialMediaAdminBackend.Services.Implementations;

public class AdminAnalyticsService : IAdminAnalyticsService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AdminAnalyticsService> _logger;

    public AdminAnalyticsService(
        ApplicationDbContext context,
        ILogger<AdminAnalyticsService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<AnalyticsResponse> GetAnalyticsAsync()
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var weekAgo = today.AddDays(-7);
            var monthAgo = today.AddMonths(-1);
            var startDate = today.AddDays(-30);

            var analytics = new AnalyticsResponse();

            // ============ USER ANALYTICS ============
            analytics.Users.TotalUsers = await _context.Users.CountAsync();
            analytics.Users.ActiveUsers = await _context.Users.CountAsync(u => u.IsActive);
            analytics.Users.InactiveUsers = analytics.Users.TotalUsers - analytics.Users.ActiveUsers;
            analytics.Users.NewUsersToday = await _context.Users.CountAsync(u => u.CreatedAt.Date == today);
            analytics.Users.NewUsersThisWeek = await _context.Users.CountAsync(u => u.CreatedAt >= weekAgo);
            analytics.Users.NewUsersThisMonth = await _context.Users.CountAsync(u => u.CreatedAt >= monthAgo);

            var previousMonthUsers = await _context.Users.CountAsync(u => u.CreatedAt < monthAgo);
            analytics.Users.UserGrowthPercentage = previousMonthUsers > 0
                ? ((double)(analytics.Users.TotalUsers - previousMonthUsers) / previousMonthUsers) * 100
                : 0;

            // Average daily users (last 30 days)
            var dailyUsers = await _context.Users
                .Where(u => u.CreatedAt >= startDate)
                .GroupBy(u => u.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();
            analytics.Users.AverageDailyUsers = dailyUsers.Any() ? (long)dailyUsers.Average(d => d.Count) : 0;

            // Users by role - FIX: Convert to long
            var usersByRole = await _context.Users
                .GroupBy(u => u.Role)
                .Select(g => new { Role = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.Role, g => (long)g.Count);
            analytics.Users.UsersByRole = usersByRole;

            // ============ POST ANALYTICS ============
            analytics.Posts.TotalPosts = await _context.Posts.CountAsync();
            analytics.Posts.NewPostsToday = await _context.Posts.CountAsync(p => p.CreatedAt.Date == today);
            analytics.Posts.NewPostsThisWeek = await _context.Posts.CountAsync(p => p.CreatedAt >= weekAgo);
            analytics.Posts.NewPostsThisMonth = await _context.Posts.CountAsync(p => p.CreatedAt >= monthAgo);

            var previousMonthPosts = await _context.Posts.CountAsync(p => p.CreatedAt < monthAgo);
            analytics.Posts.PostGrowthPercentage = previousMonthPosts > 0
                ? ((double)(analytics.Posts.TotalPosts - previousMonthPosts) / previousMonthPosts) * 100
                : 0;

            // Average daily posts
            var dailyPosts = await _context.Posts
                .Where(p => p.CreatedAt >= startDate)
                .GroupBy(p => p.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();
            analytics.Posts.AverageDailyPosts = dailyPosts.Any() ? (long)dailyPosts.Average(d => d.Count) : 0;

            analytics.Posts.TotalLikesOnPosts = await _context.Likes.CountAsync();
            analytics.Posts.AverageLikesPerPost = analytics.Posts.TotalPosts > 0
                ? (double)analytics.Posts.TotalLikesOnPosts / analytics.Posts.TotalPosts
                : 0;
            analytics.Posts.TotalCommentsOnPosts = await _context.Comments.CountAsync();
            analytics.Posts.AverageCommentsPerPost = analytics.Posts.TotalPosts > 0
                ? (double)analytics.Posts.TotalCommentsOnPosts / analytics.Posts.TotalPosts
                : 0;

            // Posts by media type - FIX: Convert to long
            var postsByMediaType = await _context.Posts
                .GroupBy(p => p.MediaType ?? "TEXT")
                .Select(g => new { MediaType = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.MediaType, g => (long)g.Count);
            analytics.Posts.PostsByMediaType = postsByMediaType;

            // ============ COMMENT ANALYTICS ============
            analytics.Comments.TotalComments = await _context.Comments.CountAsync();
            analytics.Comments.NewCommentsToday = await _context.Comments.CountAsync(c => c.CreatedAt.Date == today);
            analytics.Comments.NewCommentsThisWeek = await _context.Comments.CountAsync(c => c.CreatedAt >= weekAgo);
            analytics.Comments.NewCommentsThisMonth = await _context.Comments.CountAsync(c => c.CreatedAt >= monthAgo);

            var previousMonthComments = await _context.Comments.CountAsync(c => c.CreatedAt < monthAgo);
            analytics.Comments.CommentGrowthPercentage = previousMonthComments > 0
                ? ((double)(analytics.Comments.TotalComments - previousMonthComments) / previousMonthComments) * 100
                : 0;

            // Average daily comments
            var dailyComments = await _context.Comments
                .Where(c => c.CreatedAt >= startDate)
                .GroupBy(c => c.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();
            analytics.Comments.AverageDailyComments = dailyComments.Any() ? (long)dailyComments.Average(d => d.Count) : 0;

            // Replies count
            analytics.Comments.TotalReplies = await _context.Comments.CountAsync(c => c.ParentId != null);
            var topLevelComments = analytics.Comments.TotalComments - analytics.Comments.TotalReplies;
            analytics.Comments.AverageRepliesPerComment = topLevelComments > 0
                ? (double)analytics.Comments.TotalReplies / topLevelComments
                : 0;

            // ============ MESSAGE ANALYTICS ============
            analytics.Messages.TotalMessages = await _context.Messages.CountAsync();
            analytics.Messages.NewMessagesToday = await _context.Messages.CountAsync(m => m.CreatedAt.Date == today);
            analytics.Messages.NewMessagesThisWeek = await _context.Messages.CountAsync(m => m.CreatedAt >= weekAgo);
            analytics.Messages.NewMessagesThisMonth = await _context.Messages.CountAsync(m => m.CreatedAt >= monthAgo);

            var previousMonthMessages = await _context.Messages.CountAsync(m => m.CreatedAt < monthAgo);
            analytics.Messages.MessageGrowthPercentage = previousMonthMessages > 0
                ? ((double)(analytics.Messages.TotalMessages - previousMonthMessages) / previousMonthMessages) * 100
                : 0;

            // Average daily messages
            var dailyMessages = await _context.Messages
                .Where(m => m.CreatedAt >= startDate)
                .GroupBy(m => m.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();
            analytics.Messages.AverageDailyMessages = dailyMessages.Any() ? (long)dailyMessages.Average(d => d.Count) : 0;

            analytics.Messages.TotalConversations = await _context.Conversations.CountAsync();
            analytics.Messages.ActiveConversations = await _context.Conversations
                .CountAsync(c => c.LastMessageAt >= weekAgo);
            analytics.Messages.AverageMessagesPerConversation = analytics.Messages.TotalConversations > 0
                ? (double)analytics.Messages.TotalMessages / analytics.Messages.TotalConversations
                : 0;

            // ============ REPORT ANALYTICS ============
            analytics.Reports.TotalReports = await _context.Reports.CountAsync();
            analytics.Reports.NewReportsToday = await _context.Reports.CountAsync(r => r.CreatedAt.Date == today);
            analytics.Reports.NewReportsThisWeek = await _context.Reports.CountAsync(r => r.CreatedAt >= weekAgo);
            analytics.Reports.NewReportsThisMonth = await _context.Reports.CountAsync(r => r.CreatedAt >= monthAgo);
            analytics.Reports.PendingReports = await _context.Reports.CountAsync(r => r.Status == "PENDING");
            analytics.Reports.ResolvedReports = await _context.Reports.CountAsync(r => r.Status == "RESOLVED");
            analytics.Reports.DismissedReports = await _context.Reports.CountAsync(r => r.Status == "DISMISSED");

            var totalResolved = analytics.Reports.ResolvedReports + analytics.Reports.DismissedReports;
            analytics.Reports.ReportResolutionRate = analytics.Reports.TotalReports > 0
                ? (double)totalResolved / analytics.Reports.TotalReports * 100
                : 0;

            // Average resolution time (in hours)
            var resolvedReportTimes = await _context.Reports
                .Where(r => r.Status == "RESOLVED" && r.CreatedAt != null && r.UpdatedAt != null)
                .Select(r => EF.Functions.DateDiffHour(r.CreatedAt, r.UpdatedAt))
                .ToListAsync();

            analytics.Reports.AverageResolutionTime = resolvedReportTimes.Any()
                ? (long)resolvedReportTimes.Average()
                : 0;

            return analytics;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching analytics");
            return new AnalyticsResponse();
        }
    }
}