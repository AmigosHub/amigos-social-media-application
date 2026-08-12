using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SocialMediaAdminBackend.Security;

public class JwtHelper
{
    private readonly IConfiguration _configuration;
    private readonly byte[] _secretKeyBytes;
    private readonly ILogger<JwtHelper> _logger;

    public JwtHelper(IConfiguration configuration, ILogger<JwtHelper> logger)
    {
        _configuration = configuration;
        _logger = logger;

        //var secretKeyValue = _configuration["Jwt:SecretKey"] ?? "";

        var secretKeyValue =
    Environment.GetEnvironmentVariable("JWT_SECRET")
    ?? _configuration["Jwt:SecretKey"]
    ?? "";

        // CRITICAL: Decode Base64 key
        try
        {
            _secretKeyBytes = Convert.FromBase64String(secretKeyValue);
            _logger.LogInformation("✅ Key decoded from Base64. Length: {Length} bytes", _secretKeyBytes.Length);
        }
        catch (FormatException)
        {
            _logger.LogWarning("⚠️ Key is not valid Base64. Using as UTF8 bytes.");
            _secretKeyBytes = Encoding.UTF8.GetBytes(secretKeyValue);
            _logger.LogInformation("⚠️ Key used as UTF8. Length: {Length} bytes", _secretKeyBytes.Length);
        }

        if (_secretKeyBytes.Length < 32)
        {
            _logger.LogError("❌ Key is only {Length} bytes! Minimum is 32 bytes for HS256.", _secretKeyBytes.Length);
            throw new ArgumentException("JWT secret key must be at least 32 bytes (256 bits) for HS256");
        }
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(_secretKeyBytes),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

            var role = principal.FindFirst("user_role")?.Value;
            _logger.LogInformation("✅ Token validated. Role: {Role}", role);

            return principal;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Token validation failed: {Message}", ex.Message);
            return null;
        }
    }

    public bool IsTokenValid(string token)
    {
        return ValidateToken(token) != null;
    }

    public string? GetRoleFromToken(string token)
    {
        var principal = ValidateToken(token);
        return principal?.FindFirst("user_role")?.Value;
    }

    public long? GetUserIdFromToken(string token)
    {
        var principal = ValidateToken(token);
        var userIdClaim = principal?.FindFirst("user_id")?.Value;
        return userIdClaim != null ? long.Parse(userIdClaim) : null;
    }

    public string? GetUsernameFromToken(string token)
    {
        var principal = ValidateToken(token);
        return principal?.FindFirst(ClaimTypes.Name)?.Value;
    }
}