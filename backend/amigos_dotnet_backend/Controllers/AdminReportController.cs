
//////using Microsoft.AspNetCore.Authorization;
//////using Microsoft.AspNetCore.Mvc;
//////using SocialMediaAdminBackend.Security;
//////using SocialMediaAdminBackend.Services.Interfaces;

//////namespace SocialMediaAdminBackend.Controllers;

//////[ApiController]
//////[Route("api/admin")]
//////[Authorize]
//////[ServiceFilter(typeof(AdminAuthorizationFilter))]
//////public class AdminReportController : ControllerBase
//////{
//////    private readonly IAdminReportService _reportService;
//////    private readonly ILogger<AdminReportController> _logger;

//////    public AdminReportController(IAdminReportService reportService, ILogger<AdminReportController> logger)
//////    {
//////        _reportService = reportService;
//////        _logger = logger;
//////    }

//////    // ============ REPORT MANAGEMENT ============

//////    [HttpGet("reports")]
//////    public async Task<ActionResult> GetReports(
//////        [FromQuery] int page = 0,
//////        [FromQuery] int size = 20,
//////        [FromQuery] string? status = null)
//////    {
//////        try
//////        {
//////            var reports = await _reportService.GetReportsAsync(page, size, status);
//////            return Ok(new { success = true, data = reports });
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, "Error fetching reports");
//////            return StatusCode(500, new { success = false, message = "Failed to fetch reports" });
//////        }
//////    }

//////    [HttpGet("reports/pending")]
//////    public async Task<ActionResult> GetPendingReports()
//////    {
//////        try
//////        {
//////            var reports = await _reportService.GetPendingReportsAsync();
//////            return Ok(new { success = true, data = reports });
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, "Error fetching pending reports");
//////            return StatusCode(500, new { success = false, message = "Failed to fetch pending reports" });
//////        }
//////    }

//////    [HttpGet("reports/{reportId}")]
//////    public async Task<ActionResult> GetReport(long reportId)
//////    {
//////        try
//////        {
//////            var report = await _reportService.GetReportByIdAsync(reportId);
//////            if (report.Id == 0)
//////                return NotFound(new { success = false, message = "Report not found" });

//////            return Ok(new { success = true, data = report });
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, $"Error fetching report {reportId}");
//////            return StatusCode(500, new { success = false, message = "Failed to fetch report" });
//////        }
//////    }

//////    [HttpGet("reports/statistics")]
//////    public async Task<ActionResult> GetReportStatistics()
//////    {
//////        try
//////        {
//////            var stats = await _reportService.GetReportStatisticsAsync();
//////            return Ok(new { success = true, data = stats });
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, "Error fetching report statistics");
//////            return StatusCode(500, new { success = false, message = "Failed to fetch report statistics" });
//////        }
//////    }

//////    [HttpPut("reports/{reportId}/resolve")]
//////    public async Task<ActionResult> ResolveReport(long reportId, [FromBody] Models.DTOs.Request.AdminActionRequest request)
//////    {
//////        try
//////        {
//////            var result = await _reportService.ResolveReportAsync(reportId, request);
//////            if (!result)
//////                return StatusCode(500, new { success = false, message = "Failed to resolve report" });

//////            return Ok(new { success = true, message = "Report resolved successfully" });
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, $"Error resolving report {reportId}");
//////            return StatusCode(500, new { success = false, message = "Failed to resolve report" });
//////        }
//////    }

//////    [HttpPut("reports/{reportId}/dismiss")]
//////    public async Task<ActionResult> DismissReport(long reportId, [FromBody] Models.DTOs.Request.AdminActionRequest request)
//////    {
//////        try
//////        {
//////            var result = await _reportService.DismissReportAsync(reportId, request.Reason ?? "No reason provided");
//////            if (!result)
//////                return StatusCode(500, new { success = false, message = "Failed to dismiss report" });

//////            return Ok(new { success = true, message = "Report dismissed successfully" });
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, $"Error dismissing report {reportId}");
//////            return StatusCode(500, new { success = false, message = "Failed to dismiss report" });
//////        }
//////    }
//////}

////using Microsoft.AspNetCore.Authorization;
////using Microsoft.AspNetCore.Mvc;
////using SocialMediaAdminBackend.Security;
////using SocialMediaAdminBackend.Services.Interfaces;
////using SocialMediaAdminBackend.Models.DTOs.Request;

////namespace SocialMediaAdminBackend.Controllers;

////[ApiController]
////[Route("api/admin/reports")]
////[Authorize]
////[ServiceFilter(typeof(AdminAuthorizationFilter))]
////public class AdminReportController : ControllerBase
////{
////    private readonly IAdminReportService _reportService;
////    private readonly ILogger<AdminReportController> _logger;

////    public AdminReportController(IAdminReportService reportService, ILogger<AdminReportController> logger)
////    {
////        _reportService = reportService;
////        _logger = logger;
////    }

////    [HttpGet]
////    public async Task<ActionResult> GetReports(
////        [FromQuery] int page = 0,
////        [FromQuery] int size = 20,
////        [FromQuery] string? status = null)
////    {
////        try
////        {
////            var reports = await _reportService.GetReportsAsync(page, size, status);
////            return Ok(new { success = true, data = reports });
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, "Error fetching reports");
////            return StatusCode(500, new { success = false, message = "Failed to fetch reports" });
////        }
////    }

////    [HttpGet("pending")]
////    public async Task<ActionResult> GetPendingReports()
////    {
////        try
////        {
////            var reports = await _reportService.GetPendingReportsAsync();
////            return Ok(new { success = true, data = reports });
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, "Error fetching pending reports");
////            return StatusCode(500, new { success = false, message = "Failed to fetch pending reports" });
////        }
////    }

////    [HttpGet("{reportId}")]
////    public async Task<ActionResult> GetReport(long reportId)
////    {
////        try
////        {
////            var report = await _reportService.GetReportByIdAsync(reportId);
////            if (report.Id == 0)
////                return NotFound(new { success = false, message = "Report not found" });

////            return Ok(new { success = true, data = report });
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, $"Error fetching report {reportId}");
////            return StatusCode(500, new { success = false, message = "Failed to fetch report" });
////        }
////    }

////    [HttpGet("statistics")]
////    public async Task<ActionResult> GetReportStatistics()
////    {
////        try
////        {
////            var stats = await _reportService.GetReportStatisticsAsync();
////            return Ok(new { success = true, data = stats });
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, "Error fetching report statistics");
////            return StatusCode(500, new { success = false, message = "Failed to fetch report statistics" });
////        }
////    }

////    // ============ FIXED: Resolve Report ============
////    [HttpPut("{reportId}/resolve")]
////    public async Task<ActionResult> ResolveReport(long reportId, [FromBody] AdminActionRequest request)
////    {
////        try
////        {
////            // Log the request
////            _logger.LogInformation($"Resolving report {reportId}");

////            // Validate request body
////            if (request == null)
////            {
////                return BadRequest(new { success = false, message = "Request body is required" });
////            }

////            // Call service to resolve report
////            var result = await _reportService.ResolveReportAsync(reportId, request);

////            if (!result)
////            {
////                return StatusCode(500, new { success = false, message = "Failed to resolve report" });
////            }

////            return Ok(new { success = true, message = "Report resolved successfully" });
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, $"Error resolving report {reportId}");
////            return StatusCode(500, new
////            {
////                success = false,
////                message = $"Error resolving report: {ex.Message}"
////            });
////        }
////    }

////    // ============ FIXED: Dismiss Report ============
////    [HttpPut("{reportId}/dismiss")]
////    public async Task<ActionResult> DismissReport(long reportId, [FromBody] AdminActionRequest request)
////    {
////        try
////        {
////            _logger.LogInformation($"Dismissing report {reportId}");

////            if (request == null)
////            {
////                return BadRequest(new { success = false, message = "Request body is required" });
////            }

////            var result = await _reportService.DismissReportAsync(reportId, request.Reason ?? "No reason provided");

////            if (!result)
////            {
////                return StatusCode(500, new { success = false, message = "Failed to dismiss report" });
////            }

////            return Ok(new { success = true, message = "Report dismissed successfully" });
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, $"Error dismissing report {reportId}");
////            return StatusCode(500, new
////            {
////                success = false,
////                message = $"Error dismissing report: {ex.Message}"
////            });
////        }
////    }
////}

//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using SocialMediaAdminBackend.Security;
//using SocialMediaAdminBackend.Services.Interfaces;
//using SocialMediaAdminBackend.Models.DTOs.Request;

//namespace SocialMediaAdminBackend.Controllers;

//[ApiController]
//[Route("api/admin/reports")]
//[Authorize]
//[ServiceFilter(typeof(AdminAuthorizationFilter))]
//public class AdminReportController : ControllerBase
//{
//    private readonly IAdminReportService _reportService;
//    private readonly ILogger<AdminReportController> _logger;

//    public AdminReportController(IAdminReportService reportService, ILogger<AdminReportController> logger)
//    {
//        _reportService = reportService;
//        _logger = logger;
//    }

//    /// <summary>
//    /// Get all reports with pagination and optional status filter
//    /// </summary>
//    [HttpGet]
//    public async Task<ActionResult> GetReports(
//        [FromQuery] int page = 0,
//        [FromQuery] int size = 20,
//        [FromQuery] string? status = null)
//    {
//        try
//        {
//            var reports = await _reportService.GetReportsAsync(page, size, status);
//            return Ok(new { success = true, data = reports });
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, "Error fetching reports");
//            return StatusCode(500, new { success = false, message = "Failed to fetch reports" });
//        }
//    }

//    /// <summary>
//    /// Get all pending reports
//    /// </summary>
//    [HttpGet("pending")]
//    public async Task<ActionResult> GetPendingReports()
//    {
//        try
//        {
//            var reports = await _reportService.GetPendingReportsAsync();
//            return Ok(new { success = true, data = reports });
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, "Error fetching pending reports");
//            return StatusCode(500, new { success = false, message = "Failed to fetch pending reports" });
//        }
//    }

//    /// <summary>
//    /// Get a specific report by ID
//    /// </summary>
//    [HttpGet("{reportId}")]
//    public async Task<ActionResult> GetReport(long reportId)
//    {
//        try
//        {
//            var report = await _reportService.GetReportByIdAsync(reportId);
//            if (report.Id == 0)
//                return NotFound(new { success = false, message = "Report not found" });

//            return Ok(new { success = true, data = report });
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, $"Error fetching report {reportId}");
//            return StatusCode(500, new { success = false, message = "Failed to fetch report" });
//        }
//    }

//    /// <summary>
//    /// Get report statistics
//    /// </summary>
//    [HttpGet("statistics")]
//    public async Task<ActionResult> GetReportStatistics()
//    {
//        try
//        {
//            var stats = await _reportService.GetReportStatisticsAsync();
//            return Ok(new { success = true, data = stats });
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, "Error fetching report statistics");
//            return StatusCode(500, new { success = false, message = "Failed to fetch report statistics" });
//        }
//    }

//    /// <summary>
//    /// Resolve a report
//    /// </summary>
//    [HttpPut("{reportId}/resolve")]
//    public async Task<ActionResult> ResolveReport(long reportId, [FromBody] AdminActionRequest request)
//    {
//        try
//        {
//            _logger.LogInformation($"=== RESOLVE REPORT REQUEST ===");
//            _logger.LogInformation($"Report ID: {reportId}");
//            _logger.LogInformation($"Request Body: Action={request?.Action}, Reason={request?.Reason}");

//            // Validate report ID
//            if (reportId <= 0)
//            {
//                return BadRequest(new { success = false, message = "Invalid report ID" });
//            }

//            // Validate request body
//            if (request == null)
//            {
//                return BadRequest(new { success = false, message = "Request body is required" });
//            }

//            // Call service to resolve report
//            var (success, message) = await _reportService.ResolveReportAsync(reportId, request);

//            if (!success)
//            {
//                _logger.LogWarning($"Failed to resolve report {reportId}: {message}");
//                return StatusCode(500, new { success = false, message = message ?? "Failed to resolve report" });
//            }

//            _logger.LogInformation($"✅ Report {reportId} resolved successfully");
//            return Ok(new { success = true, message = message ?? "Report resolved successfully" });
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, $"❌ Error resolving report {reportId}");
//            return StatusCode(500, new
//            {
//                success = false,
//                message = $"Error resolving report: {ex.Message}"
//            });
//        }
//    }

//    /// <summary>
//    /// Dismiss a report
//    /// </summary>
//    [HttpPut("{reportId}/dismiss")]
//    public async Task<ActionResult> DismissReport(long reportId, [FromBody] AdminActionRequest request)
//    {
//        try
//        {
//            _logger.LogInformation($"=== DISMISS REPORT REQUEST ===");
//            _logger.LogInformation($"Report ID: {reportId}");
//            _logger.LogInformation($"Request Body: Reason={request?.Reason}");

//            // Validate report ID
//            if (reportId <= 0)
//            {
//                return BadRequest(new { success = false, message = "Invalid report ID" });
//            }

//            // Validate request body
//            if (request == null)
//            {
//                return BadRequest(new { success = false, message = "Request body is required" });
//            }

//            // Call service to dismiss report
//            var (success, message) = await _reportService.DismissReportAsync(reportId, request.Reason ?? "No reason provided");

//            if (!success)
//            {
//                _logger.LogWarning($"Failed to dismiss report {reportId}: {message}");
//                return StatusCode(500, new { success = false, message = message ?? "Failed to dismiss report" });
//            }

//            _logger.LogInformation($"✅ Report {reportId} dismissed successfully");
//            return Ok(new { success = true, message = message ?? "Report dismissed successfully" });
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, $"❌ Error dismissing report {reportId}");
//            return StatusCode(500, new
//            {
//                success = false,
//                message = $"Error dismissing report: {ex.Message}"
//            });
//        }
//    }
//}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaAdminBackend.Security;
using SocialMediaAdminBackend.Services.Interfaces;
using SocialMediaAdminBackend.Models.DTOs.Request;

namespace SocialMediaAdminBackend.Controllers;

[ApiController]
[Route("api/admin/reports")]
[Authorize]
[ServiceFilter(typeof(AdminAuthorizationFilter))]
public class AdminReportController : ControllerBase
{
    private readonly IAdminReportService _reportService;
    private readonly ILogger<AdminReportController> _logger;

    public AdminReportController(IAdminReportService reportService, ILogger<AdminReportController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult> GetReports(
        [FromQuery] int page = 0,
        [FromQuery] int size = 20,
        [FromQuery] string? status = null)
    {
        try
        {
            var reports = await _reportService.GetReportsAsync(page, size, status);
            return Ok(new { success = true, data = reports });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching reports");
            return StatusCode(500, new { success = false, message = "Failed to fetch reports" });
        }
    }

    [HttpGet("pending")]
    public async Task<ActionResult> GetPendingReports()
    {
        try
        {
            var reports = await _reportService.GetPendingReportsAsync();
            return Ok(new { success = true, data = reports });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching pending reports");
            return StatusCode(500, new { success = false, message = "Failed to fetch pending reports" });
        }
    }

    [HttpGet("{reportId}")]
    public async Task<ActionResult> GetReport(long reportId)
    {
        try
        {
            var report = await _reportService.GetReportByIdAsync(reportId);
            if (report.Id == 0)
                return NotFound(new { success = false, message = "Report not found" });

            return Ok(new { success = true, data = report });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error fetching report {reportId}");
            return StatusCode(500, new { success = false, message = "Failed to fetch report" });
        }
    }

    [HttpGet("statistics")]
    public async Task<ActionResult> GetReportStatistics()
    {
        try
        {
            var stats = await _reportService.GetReportStatisticsAsync();
            return Ok(new { success = true, data = stats });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching report statistics");
            return StatusCode(500, new { success = false, message = "Failed to fetch report statistics" });
        }
    }

    // ============ FIXED: Resolve Report ============
    [HttpPut("{reportId}/resolve")]
    public async Task<ActionResult> ResolveReport(long reportId, [FromBody] AdminActionRequest request)
    {
        try
        {
            _logger.LogInformation($"=== RESOLVE REPORT REQUEST ===");
            _logger.LogInformation($"Report ID: {reportId}");

            if (request == null)
            {
                return BadRequest(new { success = false, message = "Request body is required" });
            }

            var (success, message) = await _reportService.ResolveReportAsync(reportId, request);

            if (!success)
            {
                return StatusCode(500, new { success = false, message = message ?? "Failed to resolve report" });
            }

            return Ok(new { success = true, message = message ?? "Report resolved successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error resolving report {reportId}");
            return StatusCode(500, new
            {
                success = false,
                message = $"Error resolving report: {ex.Message}"
            });
        }
    }

    // ============ FIXED: Dismiss Report ============
    [HttpPut("{reportId}/dismiss")]
    public async Task<ActionResult> DismissReport(long reportId, [FromBody] AdminActionRequest request)
    {
        try
        {
            _logger.LogInformation($"=== DISMISS REPORT REQUEST ===");
            _logger.LogInformation($"Report ID: {reportId}");

            if (request == null)
            {
                return BadRequest(new { success = false, message = "Request body is required" });
            }

            var (success, message) = await _reportService.DismissReportAsync(reportId, request.Reason ?? "No reason provided");

            if (!success)
            {
                return StatusCode(500, new { success = false, message = message ?? "Failed to dismiss report" });
            }

            return Ok(new { success = true, message = message ?? "Report dismissed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error dismissing report {reportId}");
            return StatusCode(500, new
            {
                success = false,
                message = $"Error dismissing report: {ex.Message}"
            });
        }
    }
}