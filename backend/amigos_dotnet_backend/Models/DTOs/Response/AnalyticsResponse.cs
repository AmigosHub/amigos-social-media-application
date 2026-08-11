namespace SocialMediaAdminBackend.Models.DTOs.Response;

public class AnalyticsResponse
{
    public UserAnalytics Users { get; set; } = new();
    public PostAnalytics Posts { get; set; } = new();
    public CommentAnalytics Comments { get; set; } = new();
    public MessageAnalytics Messages { get; set; } = new();
    public ReportAnalytics Reports { get; set; } = new();
}

public class UserAnalytics
{
    public long TotalUsers { get; set; }
    public long ActiveUsers { get; set; }
    public long InactiveUsers { get; set; }
    public long NewUsersToday { get; set; }
    public long NewUsersThisWeek { get; set; }
    public long NewUsersThisMonth { get; set; }
    public double UserGrowthPercentage { get; set; }
    public long AverageDailyUsers { get; set; }
    public Dictionary<string, long> UsersByRole { get; set; } = new();
}

public class PostAnalytics
{
    public long TotalPosts { get; set; }
    public long NewPostsToday { get; set; }
    public long NewPostsThisWeek { get; set; }
    public long NewPostsThisMonth { get; set; }
    public double PostGrowthPercentage { get; set; }
    public long AverageDailyPosts { get; set; }
    public long TotalLikesOnPosts { get; set; }
    public double AverageLikesPerPost { get; set; }
    public long TotalCommentsOnPosts { get; set; }
    public double AverageCommentsPerPost { get; set; }
    public Dictionary<string, long> PostsByMediaType { get; set; } = new();
}

public class CommentAnalytics
{
    public long TotalComments { get; set; }
    public long NewCommentsToday { get; set; }
    public long NewCommentsThisWeek { get; set; }
    public long NewCommentsThisMonth { get; set; }
    public double CommentGrowthPercentage { get; set; }
    public long AverageDailyComments { get; set; }
    public long TotalReplies { get; set; }
    public double AverageRepliesPerComment { get; set; }
}

public class MessageAnalytics
{
    public long TotalMessages { get; set; }
    public long NewMessagesToday { get; set; }
    public long NewMessagesThisWeek { get; set; }
    public long NewMessagesThisMonth { get; set; }
    public double MessageGrowthPercentage { get; set; }
    public long AverageDailyMessages { get; set; }
    public long TotalConversations { get; set; }
    public long ActiveConversations { get; set; }
    public double AverageMessagesPerConversation { get; set; }
}

public class ReportAnalytics
{
    public long TotalReports { get; set; }
    public long NewReportsToday { get; set; }
    public long NewReportsThisWeek { get; set; }
    public long NewReportsThisMonth { get; set; }
    public long PendingReports { get; set; }
    public long ResolvedReports { get; set; }
    public long DismissedReports { get; set; }
    public double ReportResolutionRate { get; set; }
    public long AverageResolutionTime { get; set; }
}