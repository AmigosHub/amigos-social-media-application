using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace SocialMediaAdminBackend.Security;

public class AdminAuthorizationFilter : IAuthorizationFilter
{
    private readonly ILogger<AdminAuthorizationFilter> _logger;

    public AdminAuthorizationFilter(ILogger<AdminAuthorizationFilter> logger)
    {
        _logger = logger;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        if (!user.Identity?.IsAuthenticated ?? true)
        {
            _logger.LogWarning("Unauthorized access attempt");
            context.Result = new UnauthorizedObjectResult(new { success = false, message = "User is not authenticated" });
            return;
        }

        var role = user.FindFirst("user_role")?.Value;

        if (role != "ADMIN")
        {
            _logger.LogWarning($"Non-admin user attempted to access admin endpoint: {user.FindFirst("user_id")?.Value}");
            context.Result = new ForbidResult();
            return;
        }

        _logger.LogInformation($"Admin access granted for user: {user.FindFirst("user_id")?.Value}");
    }
}