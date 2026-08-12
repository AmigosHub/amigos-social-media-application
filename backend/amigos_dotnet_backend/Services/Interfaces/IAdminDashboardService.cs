
using SocialMediaAdminBackend.Models.DTOs.Response;

namespace SocialMediaAdminBackend.Services.Interfaces;

public interface IAdminDashboardService
{
    Task<AdminDashboardStats> GetDashboardStatsAsync();
    Task<List<DailyActivityStats>> GetDailyActivityAsync(DateTime startDate, DateTime endDate);
    Task<List<DailyUserStats>> GetUserGrowthAsync(DateTime startDate, DateTime endDate);
}