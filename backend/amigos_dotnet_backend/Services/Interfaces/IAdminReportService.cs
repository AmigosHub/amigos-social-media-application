
//using SocialMediaAdminBackend.Models.DTOs.Request;
//using SocialMediaAdminBackend.Models.DTOs.Response;

//namespace SocialMediaAdminBackend.Services.Interfaces;

//public interface IAdminReportService
//{
//    // Existing methods
//    Task<PaginatedResponse<AdminReportResponse>> GetReportsAsync(int page, int size, string? status = null);
//    Task<AdminReportResponse> GetReportByIdAsync(long reportId);
//    Task<bool> ResolveReportAsync(long reportId, AdminActionRequest request);
//    Task<bool> DismissReportAsync(long reportId, string reason);

//    // New methods
//    Task<List<AdminReportResponse>> GetPendingReportsAsync();
//    Task<ReportStatisticsResponse> GetReportStatisticsAsync();
//}

using SocialMediaAdminBackend.Models.DTOs.Request;
using SocialMediaAdminBackend.Models.DTOs.Response;

namespace SocialMediaAdminBackend.Services.Interfaces;

public interface IAdminReportService
{
    // Existing methods
    Task<PaginatedResponse<AdminReportResponse>> GetReportsAsync(int page, int size, string? status = null);
    Task<AdminReportResponse> GetReportByIdAsync(long reportId);
    Task<List<AdminReportResponse>> GetPendingReportsAsync();
    Task<ReportStatisticsResponse> GetReportStatisticsAsync();

    // Updated methods with tuple return type for better error handling
    Task<(bool Success, string Message)> ResolveReportAsync(long reportId, AdminActionRequest request);
    Task<(bool Success, string Message)> DismissReportAsync(long reportId, string reason);
}