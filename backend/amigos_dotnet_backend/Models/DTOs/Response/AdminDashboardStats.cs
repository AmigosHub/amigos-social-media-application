namespace SocialMediaAdminBackend.Models.DTOs.Response;

public class AdminDashboardStats
{
    public UserStats Users { get; set; } = new();
    public PostStats Posts { get; set; } = new();
    public InteractionStats Interactions { get; set; } = new();
    public ReportStats Reports { get; set; } = new();
    public ChatStats Chat { get; set; } = new();
    public List<DailyActivityStats> RecentActivity { get; set; } = new();
    public List<DailyUserStats> UserGrowth { get; set; } = new();
}

public class UserStats
{
    public long TotalUsers { get; set; }
    public long ActiveUsers { get; set; }
    public long InactiveUsers { get; set; }
    public long BannedUsers { get; set; }
    public long NewUsersToday { get; set; }
    public long NewUsersThisWeek { get; set; }
    public long NewUsersThisMonth { get; set; }
    public double UserGrowthPercentage { get; set; }
}

public class PostStats
{
    public long TotalPosts { get; set; }
    public long NewPostsToday { get; set; }
    public long NewPostsThisWeek { get; set; }
    public long NewPostsThisMonth { get; set; }
    public double PostGrowthPercentage { get; set; }
}

public class InteractionStats
{
    public long TotalComments { get; set; }
    public long TotalLikes { get; set; }
    public long NewCommentsToday { get; set; }
    public long NewLikesToday { get; set; }
    public double AverageLikesPerPost { get; set; }
    public double AverageCommentsPerPost { get; set; }
}

public class ReportStats
{
    public long TotalReports { get; set; }
    public long PendingReports { get; set; }
    public long ResolvedReports { get; set; }
    public long DismissedReports { get; set; }
    public long NewReportsToday { get; set; }
}

public class ChatStats
{
    public long TotalMessages { get; set; }
    public long TotalConversations { get; set; }
    public long ActiveConversations { get; set; }
    public long NewMessagesToday { get; set; }
}

public class DailyActivityStats
{
    public DateTime Date { get; set; }
    public long NewPosts { get; set; }
    public long NewComments { get; set; }
    public long NewLikes { get; set; }
    public long NewMessages { get; set; }
    public long NewUsers { get; set; }
}

public class DailyUserStats
{
    public DateTime Date { get; set; }
    public long TotalUsers { get; set; }
    public long ActiveUsers { get; set; }
    public long NewUsers { get; set; }
}