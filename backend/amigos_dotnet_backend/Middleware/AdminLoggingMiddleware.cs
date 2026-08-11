using System.Text;

namespace SocialMediaAdminBackend.Middleware;

public class AdminLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AdminLoggingMiddleware> _logger;

    public AdminLoggingMiddleware(RequestDelegate next, ILogger<AdminLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log request
        _logger.LogInformation($"Admin API Request: {context.Request.Method} {context.Request.Path}");

        // Call the next middleware
        await _next(context);

        // Log response
        _logger.LogInformation($"Admin API Response: {context.Response.StatusCode}");
    }
}