using SocialMediaAdminBackend.Models.DTOs.Response;

namespace SocialMediaAdminBackend.Services.Interfaces;

public interface IAdminAnalyticsService
{
    Task<AnalyticsResponse> GetAnalyticsAsync();
}