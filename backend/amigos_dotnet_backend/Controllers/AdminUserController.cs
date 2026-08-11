
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaAdminBackend.Security;
using SocialMediaAdminBackend.Services.Interfaces;

namespace SocialMediaAdminBackend.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
[ServiceFilter(typeof(AdminAuthorizationFilter))]
public class AdminUserController : ControllerBase
{
    private readonly IAdminUserService _userService;
    private readonly ILogger<AdminUserController> _logger;

    public AdminUserController(IAdminUserService userService, ILogger<AdminUserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    // ============ USER MANAGEMENT ============

    [HttpGet("users")]
    public async Task<ActionResult> GetUsers(
        [FromQuery] int page = 0,
        [FromQuery] int size = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? role = null,
        [FromQuery] bool? isActive = null)
    {
        try
        {
            var users = await _userService.GetUsersAsync(page, size, search, role, isActive);
            return Ok(new { success = true, data = users });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users");
            return StatusCode(500, new { success = false, message = "Failed to fetch users" });
        }
    }

    [HttpGet("users/{userId}")]
    public async Task<ActionResult> GetUser(long userId)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user.Id == 0)
                return NotFound(new { success = false, message = "User not found" });

            return Ok(new { success = true, data = user });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error fetching user {userId}");
            return StatusCode(500, new { success = false, message = "Failed to fetch user" });
        }
    }

    [HttpGet("banned-users")]
    public async Task<ActionResult> GetBannedUsers(
        [FromQuery] int page = 0,
        [FromQuery] int size = 20)
    {
        try
        {
            var users = await _userService.GetBannedUsersAsync(page, size);
            return Ok(new { success = true, data = users });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching banned users");
            return StatusCode(500, new { success = false, message = "Failed to fetch banned users" });
        }
    }

    [HttpPatch("users/{userId}/activate")]
    public async Task<ActionResult> ActivateUser(long userId)
    {
        try
        {
            var result = await _userService.ActivateUserAsync(userId);
            if (!result)
                return StatusCode(500, new { success = false, message = "Failed to activate user" });

            return Ok(new { success = true, message = "User activated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error activating user {userId}");
            return StatusCode(500, new { success = false, message = "Failed to activate user" });
        }
    }

    [HttpPatch("users/{userId}/deactivate")]
    public async Task<ActionResult> DeactivateUser(long userId)
    {
        try
        {
            var result = await _userService.DeactivateUserAsync(userId);
            if (!result)
                return StatusCode(500, new { success = false, message = "Failed to deactivate user" });

            return Ok(new { success = true, message = "User deactivated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deactivating user {userId}");
            return StatusCode(500, new { success = false, message = "Failed to deactivate user" });
        }
    }

    [HttpPost("users/{userId}/ban")]
    public async Task<ActionResult> BanUser(long userId, [FromBody] Models.DTOs.Request.AdminActionRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Reason))
                return BadRequest(new { success = false, message = "Ban reason is required" });

            var result = await _userService.BanUserAsync(userId, request.Reason, request.Duration);
            if (!result)
                return StatusCode(500, new { success = false, message = "Failed to ban user" });

            return Ok(new { success = true, message = "User banned successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error banning user {userId}");
            return StatusCode(500, new { success = false, message = "Failed to ban user" });
        }
    }

    [HttpDelete("users/{userId}/ban")]
    public async Task<ActionResult> UnbanUser(long userId)
    {
        try
        {
            var result = await _userService.UnbanUserAsync(userId);
            if (!result)
                return StatusCode(500, new { success = false, message = "Failed to unban user" });

            return Ok(new { success = true, message = "User unbanned successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error unbanning user {userId}");
            return StatusCode(500, new { success = false, message = "Failed to unban user" });
        }
    }

    [HttpDelete("users/{userId}")]
    public async Task<ActionResult> DeleteUser(long userId)
    {
        try
        {
            var result = await _userService.DeleteUserAsync(userId);
            if (!result)
                return StatusCode(500, new { success = false, message = "Failed to delete user" });

            return Ok(new { success = true, message = "User deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting user {userId}");
            return StatusCode(500, new { success = false, message = "Failed to delete user" });
        }
    }

    // ============ SEARCH ============

    [HttpGet("search/users")]
    public async Task<ActionResult> SearchUsers(
        [FromQuery] string q,
        [FromQuery] string? role = null,
        [FromQuery] int page = 0,
        [FromQuery] int size = 20)
    {
        try
        {
            if (string.IsNullOrEmpty(q))
                return BadRequest(new { success = false, message = "Search query is required" });

            var users = await _userService.SearchUsersAsync(q, page, size, role);
            return Ok(new { success = true, data = users });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching users");
            return StatusCode(500, new { success = false, message = "Failed to search users" });
        }
    }
}