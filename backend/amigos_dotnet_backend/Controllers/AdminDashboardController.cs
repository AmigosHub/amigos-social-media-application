using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaAdminBackend.Security;
using SocialMediaAdminBackend.Services.Interfaces;

namespace SocialMediaAdminBackend.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize]
[ServiceFilter(typeof(AdminAuthorizationFilter))]
public class AdminDashboardController : ControllerBase
{
    private readonly IAdminDashboardService _dashboardService;
    private readonly ILogger<AdminDashboardController> _logger;

    public AdminDashboardController(
        IAdminDashboardService dashboardService,
        ILogger<AdminDashboardController> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetDashboardStats()
    {
        try
        {
            var stats = await _dashboardService.GetDashboardStatsAsync();
            return Ok(new { success = true, data = stats });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching dashboard stats");
            return StatusCode(500, new { success = false, message = "Failed to fetch dashboard stats" });
        }
    }

    [HttpGet("activity")]
    public async Task<ActionResult> GetDailyActivity(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            var activity = await _dashboardService.GetDailyActivityAsync(startDate, endDate);
            return Ok(new { success = true, data = activity });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching daily activity");
            return StatusCode(500, new { success = false, message = "Failed to fetch daily activity" });
        }
    }

    [HttpGet("user-growth")]
    public async Task<ActionResult> GetUserGrowth(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            var growth = await _dashboardService.GetUserGrowthAsync(startDate, endDate);
            return Ok(new { success = true, data = growth });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user growth");
            return StatusCode(500, new { success = false, message = "Failed to fetch user growth" });
        }
    }
}