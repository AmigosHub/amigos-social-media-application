using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaAdminBackend.Security;
using SocialMediaAdminBackend.Services.Interfaces;

namespace SocialMediaAdminBackend.Controllers;

[ApiController]
[Route("api/admin/analytics")]
[Authorize]
[ServiceFilter(typeof(AdminAuthorizationFilter))]
public class AdminAnalyticsController : ControllerBase
{
    private readonly IAdminAnalyticsService _analyticsService;
    private readonly ILogger<AdminAnalyticsController> _logger;

    public AdminAnalyticsController(
        IAdminAnalyticsService analyticsService,
        ILogger<AdminAnalyticsController> logger)
    {
        _analyticsService = analyticsService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult> GetAnalytics()
    {
        try
        {
            var analytics = await _analyticsService.GetAnalyticsAsync();
            return Ok(new { success = true, data = analytics });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching analytics");
            return StatusCode(500, new { success = false, message = "Failed to fetch analytics" });
        }
    }

    [HttpGet("users")]
    public async Task<ActionResult> GetUserAnalytics()
    {
        try
        {
            var analytics = await _analyticsService.GetAnalyticsAsync();
            return Ok(new { success = true, data = analytics.Users });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user analytics");
            return StatusCode(500, new { success = false, message = "Failed to fetch user analytics" });
        }
    }

    [HttpGet("posts")]
    public async Task<ActionResult> GetPostAnalytics()
    {
        try
        {
            var analytics = await _analyticsService.GetAnalyticsAsync();
            return Ok(new { success = true, data = analytics.Posts });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching post analytics");
            return StatusCode(500, new { success = false, message = "Failed to fetch post analytics" });
        }
    }

    [HttpGet("comments")]
    public async Task<ActionResult> GetCommentAnalytics()
    {
        try
        {
            var analytics = await _analyticsService.GetAnalyticsAsync();
            return Ok(new { success = true, data = analytics.Comments });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching comment analytics");
            return StatusCode(500, new { success = false, message = "Failed to fetch comment analytics" });
        }
    }

    [HttpGet("messages")]
    public async Task<ActionResult> GetMessageAnalytics()
    {
        try
        {
            var analytics = await _analyticsService.GetAnalyticsAsync();
            return Ok(new { success = true, data = analytics.Messages });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching message analytics");
            return StatusCode(500, new { success = false, message = "Failed to fetch message analytics" });
        }
    }

    [HttpGet("reports")]
    public async Task<ActionResult> GetReportAnalytics()
    {
        try
        {
            var analytics = await _analyticsService.GetAnalyticsAsync();
            return Ok(new { success = true, data = analytics.Reports });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching report analytics");
            return StatusCode(500, new { success = false, message = "Failed to fetch report analytics" });
        }
    }
}