

//////using Microsoft.EntityFrameworkCore;
//////using SocialMediaAdminBackend.Data;
//////using SocialMediaAdminBackend.Models.DTOs.Request;
//////using SocialMediaAdminBackend.Models.DTOs.Response;
//////using SocialMediaAdminBackend.Models.Entities;
//////using SocialMediaAdminBackend.Services.Interfaces;

//////namespace SocialMediaAdminBackend.Services.Implementations;

//////public class AdminReportService : IAdminReportService
//////{
//////    private readonly ApplicationDbContext _context;
//////    private readonly ILogger<AdminReportService> _logger;

//////    public AdminReportService(
//////        ApplicationDbContext context,
//////        ILogger<AdminReportService> logger)
//////    {
//////        _context = context;
//////        _logger = logger;
//////    }

//////    public async Task<PaginatedResponse<AdminReportResponse>> GetReportsAsync(int page, int size, string? status = null)
//////    {
//////        try
//////        {
//////            var query = _context.Reports
//////                .Include(r => r.Reporter)
//////                .Include(r => r.ReportedUser)
//////                .Include(r => r.Post)
//////                .Include(r => r.Comment)
//////                .AsQueryable();

//////            if (!string.IsNullOrEmpty(status))
//////            {
//////                query = query.Where(r => r.Status == status);
//////            }

//////            var totalElements = await query.CountAsync();
//////            var totalPages = (int)Math.Ceiling((double)totalElements / size);

//////            var reports = await query
//////                .OrderByDescending(r => r.CreatedAt)
//////                .Skip(page * size)
//////                .Take(size)
//////                .ToListAsync();

//////            var reportResponses = reports.Select(MapToAdminReportResponse).ToList();

//////            return new PaginatedResponse<AdminReportResponse>
//////            {
//////                Content = reportResponses,
//////                PageNumber = page,
//////                PageSize = size,
//////                TotalElements = totalElements,
//////                TotalPages = totalPages,
//////                IsLast = page >= totalPages - 1
//////            };
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, "Error fetching reports");
//////            return new PaginatedResponse<AdminReportResponse>();
//////        }
//////    }

//////    public async Task<AdminReportResponse> GetReportByIdAsync(long reportId)
//////    {
//////        try
//////        {
//////            var report = await _context.Reports
//////                .Include(r => r.Reporter)
//////                .Include(r => r.ReportedUser)
//////                .Include(r => r.Post)
//////                .Include(r => r.Comment)
//////                .FirstOrDefaultAsync(r => r.Id == reportId);

//////            if (report == null)
//////                return new AdminReportResponse();

//////            return MapToAdminReportResponse(report);
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, $"Error fetching report {reportId}");
//////            return new AdminReportResponse();
//////        }
//////    }

//////    public async Task<bool> ResolveReportAsync(long reportId, AdminActionRequest request)
//////    {
//////        try
//////        {
//////            var report = await _context.Reports.FindAsync(reportId);
//////            if (report == null)
//////                return false;

//////            report.Status = "RESOLVED";
//////            report.UpdatedAt = DateTime.UtcNow;
//////            await _context.SaveChangesAsync();
//////            _logger.LogInformation($"Report {reportId} resolved successfully");
//////            return true;
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, $"Error resolving report {reportId}");
//////            return false;
//////        }
//////    }

//////    public async Task<bool> DismissReportAsync(long reportId, string reason)
//////    {
//////        try
//////        {
//////            var report = await _context.Reports.FindAsync(reportId);
//////            if (report == null)
//////                return false;

//////            report.Status = "DISMISSED";
//////            report.UpdatedAt = DateTime.UtcNow;
//////            await _context.SaveChangesAsync();
//////            _logger.LogInformation($"Report {reportId} dismissed. Reason: {reason}");
//////            return true;
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, $"Error dismissing report {reportId}");
//////            return false;
//////        }
//////    }

//////    // ============ NEW METHODS ============

//////    public async Task<List<AdminReportResponse>> GetPendingReportsAsync()
//////    {
//////        try
//////        {
//////            var reports = await _context.Reports
//////                .Include(r => r.Reporter)
//////                .Include(r => r.ReportedUser)
//////                .Include(r => r.Post)
//////                .Include(r => r.Comment)
//////                .Where(r => r.Status == "PENDING")
//////                .OrderBy(r => r.CreatedAt)
//////                .ToListAsync();

//////            return reports.Select(MapToAdminReportResponse).ToList();
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, "Error fetching pending reports");
//////            return new List<AdminReportResponse>();
//////        }
//////    }

//////    public async Task<ReportStatisticsResponse> GetReportStatisticsAsync()
//////    {
//////        try
//////        {
//////            var totalReports = await _context.Reports.CountAsync();
//////            var pendingReports = await _context.Reports.CountAsync(r => r.Status == "PENDING");
//////            var resolvedReports = await _context.Reports.CountAsync(r => r.Status == "RESOLVED");
//////            var dismissedReports = await _context.Reports.CountAsync(r => r.Status == "DISMISSED");

//////            // Reports by reason
//////            var reportsByReason = await _context.Reports
//////                .GroupBy(r => r.Reason)
//////                .Select(g => new ReportByReason
//////                {
//////                    Reason = g.Key,
//////                    Count = g.Count(),
//////                    Percentage = totalReports > 0 ? (double)g.Count() / totalReports * 100 : 0
//////                })
//////                .OrderByDescending(r => r.Count)
//////                .ToListAsync();

//////            // Reports by status
//////            var reportsByStatus = new List<ReportByStatus>
//////            {
//////                new ReportByStatus
//////                {
//////                    Status = "PENDING",
//////                    Count = pendingReports,
//////                    Percentage = totalReports > 0 ? (double)pendingReports / totalReports * 100 : 0
//////                },
//////                new ReportByStatus
//////                {
//////                    Status = "RESOLVED",
//////                    Count = resolvedReports,
//////                    Percentage = totalReports > 0 ? (double)resolvedReports / totalReports * 100 : 0
//////                },
//////                new ReportByStatus
//////                {
//////                    Status = "DISMISSED",
//////                    Count = dismissedReports,
//////                    Percentage = totalReports > 0 ? (double)dismissedReports / totalReports * 100 : 0
//////                }
//////            };

//////            // Report trend (last 30 days)
//////            var startDate = DateTime.UtcNow.AddDays(-30);
//////            var reportTrend = await _context.Reports
//////                .Where(r => r.CreatedAt >= startDate)
//////                .GroupBy(r => r.CreatedAt.Date)
//////                .Select(g => new ReportTrend
//////                {
//////                    Date = g.Key,
//////                    NewReports = g.Count(),
//////                    ResolvedReports = g.Count(r => r.Status == "RESOLVED")
//////                })
//////                .OrderBy(r => r.Date)
//////                .ToListAsync();

//////            // Calculate average resolution time (in hours)
//////            var resolvedReportTimes = await _context.Reports
//////                .Where(r => r.Status == "RESOLVED" && r.CreatedAt != null && r.UpdatedAt != null)
//////                .Select(r => EF.Functions.DateDiffHour(r.CreatedAt, r.UpdatedAt))
//////                .ToListAsync();

//////            var averageResolutionTime = resolvedReportTimes.Any()
//////                ? (long)resolvedReportTimes.Average()
//////                : 0;

//////            // Create stats object
//////            var stats = new ReportStatisticsResponse
//////            {
//////                Reports = new ReportStats
//////                {
//////                    TotalReports = totalReports,
//////                    PendingReports = pendingReports,
//////                    ResolvedReports = resolvedReports,
//////                    DismissedReports = dismissedReports,
//////                    NewReportsToday = await _context.Reports.CountAsync(r => r.CreatedAt.Date == DateTime.UtcNow.Date)
//////                },
//////                ReportsByReason = reportsByReason,
//////                ReportsByStatus = reportsByStatus,
//////                ReportTrend = reportTrend
//////            };

//////            return stats;
//////        }
//////        catch (Exception ex)
//////        {
//////            _logger.LogError(ex, "Error fetching report statistics");
//////            return new ReportStatisticsResponse();
//////        }
//////    }

//////    // ============ PRIVATE METHODS ============

//////    private AdminReportResponse MapToAdminReportResponse(Report report)
//////    {
//////        var response = new AdminReportResponse
//////        {
//////            Id = report.Id,
//////            Reason = report.Reason,
//////            Description = report.Description ?? string.Empty,
//////            Status = report.Status,
//////            CreatedAt = report.CreatedAt,
//////            ResolvedAt = report.UpdatedAt
//////        };

//////        if (report.Reporter != null)
//////        {
//////            response.Reporter = MapToAdminUserResponse(report.Reporter);
//////        }

//////        if (report.ReportedUser != null)
//////        {
//////            response.ReportedUser = MapToAdminUserResponse(report.ReportedUser);
//////        }

//////        if (report.Post != null)
//////        {
//////            response.ReportedPost = new AdminPostResponse
//////            {
//////                Id = report.Post.Id,
//////                Content = report.Post.Content ?? string.Empty,
//////                MediaUrl = report.Post.MediaUrl ?? string.Empty,
//////                MediaType = report.Post.MediaType ?? string.Empty,
//////                CreatedAt = report.Post.CreatedAt,
//////                UpdatedAt = report.Post.UpdatedAt,
//////                User = report.Post.User != null ? MapToAdminUserResponse(report.Post.User) : new AdminUserResponse()
//////            };
//////        }

//////        if (report.Comment != null)
//////        {
//////            response.ReportedComment = new AdminCommentResponse
//////            {
//////                Id = report.Comment.Id,
//////                Content = report.Comment.Content,
//////                CreatedAt = report.Comment.CreatedAt,
//////                UpdatedAt = report.Comment.UpdatedAt,
//////                IsEdited = report.Comment.IsEdited,
//////                User = report.Comment.User != null ? MapToAdminUserResponse(report.Comment.User) : new AdminUserResponse()
//////            };
//////        }

//////        return response;
//////    }

//////    private AdminUserResponse MapToAdminUserResponse(User user)
//////    {
//////        return new AdminUserResponse
//////        {
//////            Id = user.Id,
//////            Username = user.Username,
//////            Email = user.Email,
//////            FullName = user.FullName,
//////            ProfilePic = user.ProfilePic ?? string.Empty,
//////            Role = user.Role,
//////            IsActive = user.IsActive,
//////            Bio = user.Bio ?? string.Empty,
//////            IsPrivate = user.IsPrivate,
//////            LastSeen = user.LastSeen,
//////            CreatedAt = user.CreatedAt
//////        };
//////    }
//////}

////using Microsoft.EntityFrameworkCore;
////using SocialMediaAdminBackend.Data;
////using SocialMediaAdminBackend.Models.DTOs.Request;
////using SocialMediaAdminBackend.Models.DTOs.Response;
////using SocialMediaAdminBackend.Models.Entities;
////using SocialMediaAdminBackend.Services.Interfaces;

////namespace SocialMediaAdminBackend.Services.Implementations;

////public class AdminReportService : IAdminReportService
////{
////    private readonly ApplicationDbContext _context;
////    private readonly ILogger<AdminReportService> _logger;

////    public AdminReportService(
////        ApplicationDbContext context,
////        ILogger<AdminReportService> logger)
////    {
////        _context = context;
////        _logger = logger;
////    }

////    public async Task<PaginatedResponse<AdminReportResponse>> GetReportsAsync(int page, int size, string? status = null)
////    {
////        try
////        {
////            var query = _context.Reports
////                .Include(r => r.Reporter)
////                .Include(r => r.ReportedUser)
////                .Include(r => r.Post)
////                .Include(r => r.Comment)
////                .AsQueryable();

////            if (!string.IsNullOrEmpty(status))
////            {
////                query = query.Where(r => r.Status == status);
////            }

////            var totalElements = await query.CountAsync();
////            var totalPages = (int)Math.Ceiling((double)totalElements / size);

////            var reports = await query
////                .OrderByDescending(r => r.CreatedAt)
////                .Skip(page * size)
////                .Take(size)
////                .ToListAsync();

////            var reportResponses = reports.Select(MapToAdminReportResponse).ToList();

////            return new PaginatedResponse<AdminReportResponse>
////            {
////                Content = reportResponses,
////                PageNumber = page,
////                PageSize = size,
////                TotalElements = totalElements,
////                TotalPages = totalPages,
////                IsLast = page >= totalPages - 1
////            };
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, "Error fetching reports");
////            return new PaginatedResponse<AdminReportResponse>();
////        }
////    }

////    public async Task<AdminReportResponse> GetReportByIdAsync(long reportId)
////    {
////        try
////        {
////            var report = await _context.Reports
////                .Include(r => r.Reporter)
////                .Include(r => r.ReportedUser)
////                .Include(r => r.Post)
////                .Include(r => r.Comment)
////                .FirstOrDefaultAsync(r => r.Id == reportId);

////            if (report == null)
////                return new AdminReportResponse();

////            return MapToAdminReportResponse(report);
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, $"Error fetching report {reportId}");
////            return new AdminReportResponse();
////        }
////    }

////    // ============ FIXED: Resolve Report ============
////    public async Task<bool> ResolveReportAsync(long reportId, AdminActionRequest request)
////    {
////        try
////        {
////            _logger.LogInformation($"Attempting to resolve report {reportId}");

////            // Find the report with tracking
////            var report = await _context.Reports.FindAsync(reportId);

////            if (report == null)
////            {
////                _logger.LogWarning($"Report {reportId} not found");
////                return false;
////            }

////            // Check if already resolved
////            if (report.Status == "RESOLVED")
////            {
////                _logger.LogWarning($"Report {reportId} is already resolved");
////                return true; // Already resolved
////            }

////            // Update report status
////            report.Status = "RESOLVED";
////            report.UpdatedAt = DateTime.UtcNow;

////            // If action contains BAN_USER, also ban the user
////            if (request.Action == "BAN_USER" && report.ReportedUserId.HasValue)
////            {
////                var user = await _context.Users.FindAsync(report.ReportedUserId.Value);
////                if (user != null)
////                {
////                    user.IsActive = false;
////                    user.UpdatedAt = DateTime.UtcNow;
////                    _logger.LogInformation($"Banned user {user.Id} from report {reportId}");
////                }
////            }

////            // Save changes
////            await _context.SaveChangesAsync();
////            _logger.LogInformation($"Report {reportId} resolved successfully");
////            return true;
////        }
////        catch (DbUpdateException dbEx)
////        {
////            _logger.LogError(dbEx, $"Database error resolving report {reportId}");
////            return false;
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, $"Error resolving report {reportId}");
////            return false;
////        }
////    }

////    // ============ FIXED: Dismiss Report ============
////    public async Task<bool> DismissReportAsync(long reportId, string reason)
////    {
////        try
////        {
////            _logger.LogInformation($"Attempting to dismiss report {reportId}");

////            var report = await _context.Reports.FindAsync(reportId);

////            if (report == null)
////            {
////                _logger.LogWarning($"Report {reportId} not found");
////                return false;
////            }

////            // Check if already dismissed
////            if (report.Status == "DISMISSED")
////            {
////                _logger.LogWarning($"Report {reportId} is already dismissed");
////                return true; // Already dismissed
////            }

////            report.Status = "DISMISSED";
////            report.UpdatedAt = DateTime.UtcNow;

////            await _context.SaveChangesAsync();
////            _logger.LogInformation($"Report {reportId} dismissed successfully");
////            return true;
////        }
////        catch (DbUpdateException dbEx)
////        {
////            _logger.LogError(dbEx, $"Database error dismissing report {reportId}");
////            return false;
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, $"Error dismissing report {reportId}");
////            return false;
////        }
////    }

////    public async Task<List<AdminReportResponse>> GetPendingReportsAsync()
////    {
////        try
////        {
////            var reports = await _context.Reports
////                .Include(r => r.Reporter)
////                .Include(r => r.ReportedUser)
////                .Include(r => r.Post)
////                .Include(r => r.Comment)
////                .Where(r => r.Status == "PENDING")
////                .OrderBy(r => r.CreatedAt)
////                .ToListAsync();

////            return reports.Select(MapToAdminReportResponse).ToList();
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, "Error fetching pending reports");
////            return new List<AdminReportResponse>();
////        }
////    }

////    public async Task<ReportStatisticsResponse> GetReportStatisticsAsync()
////    {
////        try
////        {
////            var totalReports = await _context.Reports.CountAsync();
////            var pendingReports = await _context.Reports.CountAsync(r => r.Status == "PENDING");
////            var resolvedReports = await _context.Reports.CountAsync(r => r.Status == "RESOLVED");
////            var dismissedReports = await _context.Reports.CountAsync(r => r.Status == "DISMISSED");

////            var reportsByReason = await _context.Reports
////                .GroupBy(r => r.Reason)
////                .Select(g => new ReportByReason
////                {
////                    Reason = g.Key,
////                    Count = g.Count(),
////                    Percentage = totalReports > 0 ? (double)g.Count() / totalReports * 100 : 0
////                })
////                .OrderByDescending(r => r.Count)
////                .ToListAsync();

////            var reportsByStatus = new List<ReportByStatus>
////            {
////                new ReportByStatus
////                {
////                    Status = "PENDING",
////                    Count = pendingReports,
////                    Percentage = totalReports > 0 ? (double)pendingReports / totalReports * 100 : 0
////                },
////                new ReportByStatus
////                {
////                    Status = "RESOLVED",
////                    Count = resolvedReports,
////                    Percentage = totalReports > 0 ? (double)resolvedReports / totalReports * 100 : 0
////                },
////                new ReportByStatus
////                {
////                    Status = "DISMISSED",
////                    Count = dismissedReports,
////                    Percentage = totalReports > 0 ? (double)dismissedReports / totalReports * 100 : 0
////                }
////            };

////            var startDate = DateTime.UtcNow.AddDays(-30);
////            var reportTrend = await _context.Reports
////                .Where(r => r.CreatedAt >= startDate)
////                .GroupBy(r => r.CreatedAt.Date)
////                .Select(g => new ReportTrend
////                {
////                    Date = g.Key,
////                    NewReports = g.Count(),
////                    ResolvedReports = g.Count(r => r.Status == "RESOLVED")
////                })
////                .OrderBy(r => r.Date)
////                .ToListAsync();

////            var resolvedReportTimes = await _context.Reports
////                .Where(r => r.Status == "RESOLVED" && r.CreatedAt != null && r.UpdatedAt != null)
////                .Select(r => EF.Functions.DateDiffHour(r.CreatedAt, r.UpdatedAt))
////                .ToListAsync();

////            var averageResolutionTime = resolvedReportTimes.Any()
////                ? (long)resolvedReportTimes.Average()
////                : 0;

////            return new ReportStatisticsResponse
////            {
////                Reports = new ReportStats
////                {
////                    TotalReports = totalReports,
////                    PendingReports = pendingReports,
////                    ResolvedReports = resolvedReports,
////                    DismissedReports = dismissedReports,
////                    NewReportsToday = await _context.Reports.CountAsync(r => r.CreatedAt.Date == DateTime.UtcNow.Date)
////                },
////                ReportsByReason = reportsByReason,
////                ReportsByStatus = reportsByStatus,
////                ReportTrend = reportTrend
////            };
////        }
////        catch (Exception ex)
////        {
////            _logger.LogError(ex, "Error fetching report statistics");
////            return new ReportStatisticsResponse();
////        }
////    }

////    private AdminReportResponse MapToAdminReportResponse(Report report)
////    {
////        var response = new AdminReportResponse
////        {
////            Id = report.Id,
////            Reason = report.Reason,
////            Description = report.Description ?? string.Empty,
////            Status = report.Status,
////            CreatedAt = report.CreatedAt,
////            ResolvedAt = report.UpdatedAt
////        };

////        if (report.Reporter != null)
////        {
////            response.Reporter = MapToAdminUserResponse(report.Reporter);
////        }

////        if (report.ReportedUser != null)
////        {
////            response.ReportedUser = MapToAdminUserResponse(report.ReportedUser);
////        }

////        return response;
////    }

////    private AdminUserResponse MapToAdminUserResponse(User user)
////    {
////        return new AdminUserResponse
////        {
////            Id = user.Id,
////            Username = user.Username,
////            Email = user.Email,
////            FullName = user.FullName,
////            ProfilePic = user.ProfilePic ?? string.Empty,
////            Role = user.Role,
////            IsActive = user.IsActive
////        };
////    }
////}

//using Microsoft.EntityFrameworkCore;
//using SocialMediaAdminBackend.Data;
//using SocialMediaAdminBackend.Models.DTOs.Request;
//using SocialMediaAdminBackend.Models.DTOs.Response;
//using SocialMediaAdminBackend.Models.Entities;
//using SocialMediaAdminBackend.Services.Interfaces;

//namespace SocialMediaAdminBackend.Services.Implementations;

//public class AdminReportService : IAdminReportService
//{
//    private readonly ApplicationDbContext _context;
//    private readonly ILogger<AdminReportService> _logger;

//    public AdminReportService(
//        ApplicationDbContext context,
//        ILogger<AdminReportService> logger)
//    {
//        _context = context;
//        _logger = logger;
//    }

//    public async Task<PaginatedResponse<AdminReportResponse>> GetReportsAsync(int page, int size, string? status = null)
//    {
//        try
//        {
//            var query = _context.Reports
//                .Include(r => r.Reporter)
//                .Include(r => r.ReportedUser)
//                .Include(r => r.Post)
//                .Include(r => r.Comment)
//                .AsQueryable();

//            if (!string.IsNullOrEmpty(status))
//            {
//                query = query.Where(r => r.Status == status);
//            }

//            var totalElements = await query.CountAsync();
//            var totalPages = (int)Math.Ceiling((double)totalElements / size);

//            var reports = await query
//                .OrderByDescending(r => r.CreatedAt)
//                .Skip(page * size)
//                .Take(size)
//                .ToListAsync();

//            var reportResponses = reports.Select(MapToAdminReportResponse).ToList();

//            return new PaginatedResponse<AdminReportResponse>
//            {
//                Content = reportResponses,
//                PageNumber = page,
//                PageSize = size,
//                TotalElements = totalElements,
//                TotalPages = totalPages,
//                IsLast = page >= totalPages - 1
//            };
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, "Error fetching reports");
//            return new PaginatedResponse<AdminReportResponse>();
//        }
//    }

//    public async Task<AdminReportResponse> GetReportByIdAsync(long reportId)
//    {
//        try
//        {
//            var report = await _context.Reports
//                .Include(r => r.Reporter)
//                .Include(r => r.ReportedUser)
//                .Include(r => r.Post)
//                .Include(r => r.Comment)
//                .FirstOrDefaultAsync(r => r.Id == reportId);

//            if (report == null)
//                return new AdminReportResponse();

//            return MapToAdminReportResponse(report);
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, $"Error fetching report {reportId}");
//            return new AdminReportResponse();
//        }
//    }

//    public async Task<(bool Success, string Message)> ResolveReportAsync(long reportId, AdminActionRequest request)
//    {
//        try
//        {
//            _logger.LogInformation($"🔍 Looking for report with ID: {reportId}");

//            // Find the report
//            var report = await _context.Reports
//                .FirstOrDefaultAsync(r => r.Id == reportId);

//            if (report == null)
//            {
//                _logger.LogWarning($"❌ Report {reportId} not found in database");
//                return (false, $"Report with ID {reportId} not found");
//            }

//            _logger.LogInformation($"📋 Found report: ID={report.Id}, Status={report.Status}, Reason={report.Reason}");

//            // Check if already resolved
//            if (report.Status == "RESOLVED")
//            {
//                _logger.LogWarning($"⚠️ Report {reportId} is already resolved");
//                return (true, "Report was already resolved");
//            }

//            // Check if already dismissed
//            if (report.Status == "DISMISSED")
//            {
//                _logger.LogWarning($"⚠️ Report {reportId} is already dismissed");
//                return (false, "Cannot resolve a dismissed report");
//            }

//            // Update report status
//            report.Status = "RESOLVED";
//            report.UpdatedAt = DateTime.UtcNow;

//            // Save changes
//            int affectedRows = await _context.SaveChangesAsync();
//            _logger.LogInformation($"💾 Saved changes to database. Affected rows: {affectedRows}");

//            if (affectedRows > 0)
//            {
//                _logger.LogInformation($"✅ Report {reportId} resolved successfully");
//                return (true, "Report resolved successfully");
//            }
//            else
//            {
//                _logger.LogWarning($"⚠️ No changes were saved for report {reportId}");
//                return (false, "No changes were saved to the database");
//            }
//        }
//        catch (DbUpdateException dbEx)
//        {
//            _logger.LogError(dbEx, $"❌ Database error resolving report {reportId}");
//            return (false, $"Database error: {dbEx.InnerException?.Message ?? dbEx.Message}");
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, $"❌ Error resolving report {reportId}");
//            return (false, $"Error: {ex.Message}");
//        }
//    }

//    public async Task<(bool Success, string Message)> DismissReportAsync(long reportId, string reason)
//    {
//        try
//        {
//            _logger.LogInformation($"🔍 Looking for report with ID: {reportId}");

//            // Find the report
//            var report = await _context.Reports
//                .FirstOrDefaultAsync(r => r.Id == reportId);

//            if (report == null)
//            {
//                _logger.LogWarning($"❌ Report {reportId} not found in database");
//                return (false, $"Report with ID {reportId} not found");
//            }

//            _logger.LogInformation($"📋 Found report: ID={report.Id}, Status={report.Status}, Reason={report.Reason}");

//            // Check if already dismissed
//            if (report.Status == "DISMISSED")
//            {
//                _logger.LogWarning($"⚠️ Report {reportId} is already dismissed");
//                return (true, "Report was already dismissed");
//            }

//            // Check if already resolved
//            if (report.Status == "RESOLVED")
//            {
//                _logger.LogWarning($"⚠️ Report {reportId} is already resolved");
//                return (false, "Cannot dismiss a resolved report");
//            }

//            // Update report status
//            report.Status = "DISMISSED";
//            report.UpdatedAt = DateTime.UtcNow;

//            // Save changes
//            int affectedRows = await _context.SaveChangesAsync();
//            _logger.LogInformation($"💾 Saved changes to database. Affected rows: {affectedRows}");

//            if (affectedRows > 0)
//            {
//                _logger.LogInformation($"✅ Report {reportId} dismissed successfully");
//                return (true, "Report dismissed successfully");
//            }
//            else
//            {
//                _logger.LogWarning($"⚠️ No changes were saved for report {reportId}");
//                return (false, "No changes were saved to the database");
//            }
//        }
//        catch (DbUpdateException dbEx)
//        {
//            _logger.LogError(dbEx, $"❌ Database error dismissing report {reportId}");
//            return (false, $"Database error: {dbEx.InnerException?.Message ?? dbEx.Message}");
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, $"❌ Error dismissing report {reportId}");
//            return (false, $"Error: {ex.Message}");
//        }
//    }

//    public async Task<List<AdminReportResponse>> GetPendingReportsAsync()
//    {
//        try
//        {
//            var reports = await _context.Reports
//                .Include(r => r.Reporter)
//                .Include(r => r.ReportedUser)
//                .Include(r => r.Post)
//                .Include(r => r.Comment)
//                .Where(r => r.Status == "PENDING")
//                .OrderBy(r => r.CreatedAt)
//                .ToListAsync();

//            return reports.Select(MapToAdminReportResponse).ToList();
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, "Error fetching pending reports");
//            return new List<AdminReportResponse>();
//        }
//    }

//    public async Task<ReportStatisticsResponse> GetReportStatisticsAsync()
//    {
//        try
//        {
//            var totalReports = await _context.Reports.CountAsync();
//            var pendingReports = await _context.Reports.CountAsync(r => r.Status == "PENDING");
//            var resolvedReports = await _context.Reports.CountAsync(r => r.Status == "RESOLVED");
//            var dismissedReports = await _context.Reports.CountAsync(r => r.Status == "DISMISSED");

//            var reportsByReason = await _context.Reports
//                .GroupBy(r => r.Reason)
//                .Select(g => new ReportByReason
//                {
//                    Reason = g.Key,
//                    Count = g.Count(),
//                    Percentage = totalReports > 0 ? (double)g.Count() / totalReports * 100 : 0
//                })
//                .OrderByDescending(r => r.Count)
//                .ToListAsync();

//            var reportsByStatus = new List<ReportByStatus>
//            {
//                new ReportByStatus
//                {
//                    Status = "PENDING",
//                    Count = pendingReports,
//                    Percentage = totalReports > 0 ? (double)pendingReports / totalReports * 100 : 0
//                },
//                new ReportByStatus
//                {
//                    Status = "RESOLVED",
//                    Count = resolvedReports,
//                    Percentage = totalReports > 0 ? (double)resolvedReports / totalReports * 100 : 0
//                },
//                new ReportByStatus
//                {
//                    Status = "DISMISSED",
//                    Count = dismissedReports,
//                    Percentage = totalReports > 0 ? (double)dismissedReports / totalReports * 100 : 0
//                }
//            };

//            var startDate = DateTime.UtcNow.AddDays(-30);
//            var reportTrend = await _context.Reports
//                .Where(r => r.CreatedAt >= startDate)
//                .GroupBy(r => r.CreatedAt.Date)
//                .Select(g => new ReportTrend
//                {
//                    Date = g.Key,
//                    NewReports = g.Count(),
//                    ResolvedReports = g.Count(r => r.Status == "RESOLVED")
//                })
//                .OrderBy(r => r.Date)
//                .ToListAsync();

//            var resolvedReportTimes = await _context.Reports
//                .Where(r => r.Status == "RESOLVED" && r.CreatedAt != null && r.UpdatedAt != null)
//                .Select(r => EF.Functions.DateDiffHour(r.CreatedAt, r.UpdatedAt))
//                .ToListAsync();

//            var averageResolutionTime = resolvedReportTimes.Any()
//                ? (long)resolvedReportTimes.Average()
//                : 0;

//            return new ReportStatisticsResponse
//            {
//                Reports = new ReportStats
//                {
//                    TotalReports = totalReports,
//                    PendingReports = pendingReports,
//                    ResolvedReports = resolvedReports,
//                    DismissedReports = dismissedReports,
//                    NewReportsToday = await _context.Reports.CountAsync(r => r.CreatedAt.Date == DateTime.UtcNow.Date)
//                },
//                ReportsByReason = reportsByReason,
//                ReportsByStatus = reportsByStatus,
//                ReportTrend = reportTrend
//            };
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, "Error fetching report statistics");
//            return new ReportStatisticsResponse();
//        }
//    }

//    private AdminReportResponse MapToAdminReportResponse(Report report)
//    {
//        var response = new AdminReportResponse
//        {
//            Id = report.Id,
//            Reason = report.Reason,
//            Description = report.Description ?? string.Empty,
//            Status = report.Status,
//            CreatedAt = report.CreatedAt,
//            ResolvedAt = report.UpdatedAt
//        };

//        if (report.Reporter != null)
//        {
//            response.Reporter = MapToAdminUserResponse(report.Reporter);
//        }

//        if (report.ReportedUser != null)
//        {
//            response.ReportedUser = MapToAdminUserResponse(report.ReportedUser);
//        }

//        return response;
//    }

//    private AdminUserResponse MapToAdminUserResponse(User user)
//    {
//        return new AdminUserResponse
//        {
//            Id = user.Id,
//            Username = user.Username,
//            Email = user.Email,
//            FullName = user.FullName,
//            ProfilePic = user.ProfilePic ?? string.Empty,
//            Role = user.Role,
//            IsActive = user.IsActive
//        };
//    }
//}

using Microsoft.EntityFrameworkCore;
using SocialMediaAdminBackend.Data;
using SocialMediaAdminBackend.Models.DTOs.Request;
using SocialMediaAdminBackend.Models.DTOs.Response;
using SocialMediaAdminBackend.Models.Entities;
using SocialMediaAdminBackend.Services.Interfaces;

namespace SocialMediaAdminBackend.Services.Implementations;

public class AdminReportService : IAdminReportService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AdminReportService> _logger;

    public AdminReportService(
        ApplicationDbContext context,
        ILogger<AdminReportService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PaginatedResponse<AdminReportResponse>> GetReportsAsync(int page, int size, string? status = null)
    {
        try
        {
            var query = _context.Reports
                .Include(r => r.Reporter)
                .Include(r => r.ReportedUser)
                .Include(r => r.Post)
                .Include(r => r.Comment)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(r => r.Status == status);
            }

            var totalElements = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalElements / size);

            var reports = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip(page * size)
                .Take(size)
                .ToListAsync();

            var reportResponses = reports.Select(MapToAdminReportResponse).ToList();

            return new PaginatedResponse<AdminReportResponse>
            {
                Content = reportResponses,
                PageNumber = page,
                PageSize = size,
                TotalElements = totalElements,
                TotalPages = totalPages,
                IsLast = page >= totalPages - 1
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching reports");
            return new PaginatedResponse<AdminReportResponse>();
        }
    }

    public async Task<AdminReportResponse> GetReportByIdAsync(long reportId)
    {
        try
        {
            var report = await _context.Reports
                .Include(r => r.Reporter)
                .Include(r => r.ReportedUser)
                .Include(r => r.Post)
                .Include(r => r.Comment)
                .FirstOrDefaultAsync(r => r.Id == reportId);

            if (report == null)
                return new AdminReportResponse();

            return MapToAdminReportResponse(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error fetching report {reportId}");
            return new AdminReportResponse();
        }
    }

    // ============ FIXED: Resolve Report ============
    // Uses "REVIEWED" status (matches ENUM values: CLOSED, PENDING, REVIEWED)
    public async Task<(bool Success, string Message)> ResolveReportAsync(long reportId, AdminActionRequest request)
    {
        try
        {
            _logger.LogInformation($"🔍 Looking for report with ID: {reportId}");

            // Find the report
            var report = await _context.Reports
                .FirstOrDefaultAsync(r => r.Id == reportId);

            if (report == null)
            {
                _logger.LogWarning($"❌ Report {reportId} not found in database");
                return (false, $"Report with ID {reportId} not found");
            }

            _logger.LogInformation($"📋 Found report: ID={report.Id}, Status={report.Status}");

            // Check if already reviewed (resolved)
            if (report.Status == "REVIEWED")
            {
                _logger.LogWarning($"⚠️ Report {reportId} is already reviewed");
                return (true, "Report was already reviewed");
            }

            // Check if already closed (dismissed)
            if (report.Status == "CLOSED")
            {
                _logger.LogWarning($"⚠️ Report {reportId} is already closed");
                return (false, "Cannot review a closed report");
            }

            // ✅ FIX: Use "REVIEWED" status (exists in ENUM)
            report.Status = "REVIEWED";
            report.UpdatedAt = DateTime.UtcNow;

            // Process action if needed
            if (request.Action == "BAN_USER" && report.ReportedUserId.HasValue)
            {
                var user = await _context.Users.FindAsync(report.ReportedUserId.Value);
                if (user != null)
                {
                    user.IsActive = false;
                    user.UpdatedAt = DateTime.UtcNow;
                    _logger.LogInformation($"✅ Banned user {user.Id} from report {reportId}");
                }
            }

            // Save changes
            int affectedRows = await _context.SaveChangesAsync();
            _logger.LogInformation($"💾 Saved changes. Affected rows: {affectedRows}");

            if (affectedRows > 0)
            {
                return (true, "Report reviewed successfully");
            }
            else
            {
                return (false, "No changes were saved to the database");
            }
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, $"❌ Database error reviewing report {reportId}");
            return (false, $"Database error: {dbEx.InnerException?.Message ?? dbEx.Message}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error reviewing report {reportId}");
            return (false, $"Error: {ex.Message}");
        }
    }

    // ============ FIXED: Dismiss Report ============
    // Uses "CLOSED" status (matches ENUM values: CLOSED, PENDING, REVIEWED)
    public async Task<(bool Success, string Message)> DismissReportAsync(long reportId, string reason)
    {
        try
        {
            _logger.LogInformation($"🔍 Looking for report with ID: {reportId}");

            // Find the report
            var report = await _context.Reports
                .FirstOrDefaultAsync(r => r.Id == reportId);

            if (report == null)
            {
                _logger.LogWarning($"❌ Report {reportId} not found in database");
                return (false, $"Report with ID {reportId} not found");
            }

            _logger.LogInformation($"📋 Found report: ID={report.Id}, Status={report.Status}");

            // Check if already closed (dismissed)
            if (report.Status == "CLOSED")
            {
                _logger.LogWarning($"⚠️ Report {reportId} is already closed");
                return (true, "Report was already closed");
            }

            // Check if already reviewed (resolved)
            if (report.Status == "REVIEWED")
            {
                _logger.LogWarning($"⚠️ Report {reportId} is already reviewed");
                return (false, "Cannot close a reviewed report");
            }

            // ✅ FIX: Use "CLOSED" status (exists in ENUM)
            report.Status = "CLOSED";
            report.UpdatedAt = DateTime.UtcNow;

            // Save changes
            int affectedRows = await _context.SaveChangesAsync();
            _logger.LogInformation($"💾 Saved changes. Affected rows: {affectedRows}");

            if (affectedRows > 0)
            {
                return (true, "Report closed successfully");
            }
            else
            {
                return (false, "No changes were saved to the database");
            }
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, $"❌ Database error closing report {reportId}");
            return (false, $"Database error: {dbEx.InnerException?.Message ?? dbEx.Message}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error closing report {reportId}");
            return (false, $"Error: {ex.Message}");
        }
    }

    public async Task<List<AdminReportResponse>> GetPendingReportsAsync()
    {
        try
        {
            var reports = await _context.Reports
                .Include(r => r.Reporter)
                .Include(r => r.ReportedUser)
                .Include(r => r.Post)
                .Include(r => r.Comment)
                .Where(r => r.Status == "PENDING")
                .OrderBy(r => r.CreatedAt)
                .ToListAsync();

            return reports.Select(MapToAdminReportResponse).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching pending reports");
            return new List<AdminReportResponse>();
        }
    }

    //public async Task<ReportStatisticsResponse> GetReportStatisticsAsync()
    //{
    //    try
    //    {
    //        var totalReports = await _context.Reports.CountAsync();
    //        var pendingReports = await _context.Reports.CountAsync(r => r.Status == "PENDING");
    //        var reviewedReports = await _context.Reports.CountAsync(r => r.Status == "REVIEWED");
    //        var closedReports = await _context.Reports.CountAsync(r => r.Status == "CLOSED");

    //        var reportsByReason = await _context.Reports
    //            .GroupBy(r => r.Reason)
    //            .Select(g => new ReportByReason
    //            {
    //                Reason = g.Key,
    //                Count = g.Count(),
    //                Percentage = totalReports > 0 ? (double)g.Count() / totalReports * 100 : 0
    //            })
    //            .OrderByDescending(r => r.Count)
    //            .ToListAsync();

    //        var reportsByStatus = new List<ReportByStatus>
    //        {
    //            new ReportByStatus
    //            {
    //                Status = "PENDING",
    //                Count = pendingReports,
    //                Percentage = totalReports > 0 ? (double)pendingReports / totalReports * 100 : 0
    //            },
    //            new ReportByStatus
    //            {
    //                Status = "REVIEWED",
    //                Count = reviewedReports,
    //                Percentage = totalReports > 0 ? (double)reviewedReports / totalReports * 100 : 0
    //            },
    //            new ReportByStatus
    //            {
    //                Status = "CLOSED",
    //                Count = closedReports,
    //                Percentage = totalReports > 0 ? (double)closedReports / totalReports * 100 : 0
    //            }
    //        };

    //        var startDate = DateTime.UtcNow.AddDays(-30);
    //        var reportTrend = await _context.Reports
    //            .Where(r => r.CreatedAt >= startDate)
    //            .GroupBy(r => r.CreatedAt.Date)
    //            .Select(g => new ReportTrend
    //            {
    //                Date = g.Key,
    //                NewReports = g.Count(),
    //                ReviewedReports = g.Count(r => r.Status == "REVIEWED")
    //            })
    //            .OrderBy(r => r.Date)
    //            .ToListAsync();

    //        var reviewedReportTimes = await _context.Reports
    //            .Where(r => r.Status == "REVIEWED" && r.CreatedAt != null && r.UpdatedAt != null)
    //            .Select(r => EF.Functions.DateDiffHour(r.CreatedAt, r.UpdatedAt))
    //            .ToListAsync();

    //        var averageResolutionTime = reviewedReportTimes.Any()
    //            ? (long)reviewedReportTimes.Average()
    //            : 0;

    //        return new ReportStatisticsResponse
    //        {
    //            Reports = new ReportStats
    //            {
    //                TotalReports = totalReports,
    //                PendingReports = pendingReports,
    //                ResolvedReports = reviewedReports,
    //                DismissedReports = closedReports,
    //                NewReportsToday = await _context.Reports.CountAsync(r => r.CreatedAt.Date == DateTime.UtcNow.Date)
    //            },
    //            ReportsByReason = reportsByReason,
    //            ReportsByStatus = reportsByStatus,
    //            ReportTrend = reportTrend
    //        };
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error fetching report statistics");
    //        return new ReportStatisticsResponse();
    //    }
    //}

    public async Task<ReportStatisticsResponse> GetReportStatisticsAsync()
    {
        try
        {
            var totalReports = await _context.Reports.CountAsync();
            var pendingReports = await _context.Reports.CountAsync(r => r.Status == "PENDING");
            var reviewedReports = await _context.Reports.CountAsync(r => r.Status == "REVIEWED");
            var closedReports = await _context.Reports.CountAsync(r => r.Status == "CLOSED");

            var reportsByReason = await _context.Reports
                .GroupBy(r => r.Reason)
                .Select(g => new ReportByReason
                {
                    Reason = g.Key,
                    Count = g.Count(),
                    Percentage = totalReports > 0 ? (double)g.Count() / totalReports * 100 : 0
                })
                .OrderByDescending(r => r.Count)
                .ToListAsync();

            var reportsByStatus = new List<ReportByStatus>
        {
            new ReportByStatus
            {
                Status = "PENDING",
                Count = pendingReports,
                Percentage = totalReports > 0 ? (double)pendingReports / totalReports * 100 : 0
            },
            new ReportByStatus
            {
                Status = "REVIEWED",
                Count = reviewedReports,
                Percentage = totalReports > 0 ? (double)reviewedReports / totalReports * 100 : 0
            },
            new ReportByStatus
            {
                Status = "CLOSED",
                Count = closedReports,
                Percentage = totalReports > 0 ? (double)closedReports / totalReports * 100 : 0
            }
        };

            var startDate = DateTime.UtcNow.AddDays(-30);
            var reportTrend = await _context.Reports
                .Where(r => r.CreatedAt >= startDate)
                .GroupBy(r => r.CreatedAt.Date)
                .Select(g => new ReportTrend
                {
                    Date = g.Key,
                    NewReports = g.Count(),
                    ResolvedReports = g.Count(r => r.Status == "REVIEWED")  // ✅ Changed to ResolvedReports
                })
                .OrderBy(r => r.Date)
                .ToListAsync();

            var reviewedReportTimes = await _context.Reports
                .Where(r => r.Status == "REVIEWED" && r.CreatedAt != null && r.UpdatedAt != null)
                .Select(r => EF.Functions.DateDiffHour(r.CreatedAt, r.UpdatedAt))
                .ToListAsync();

            var averageResolutionTime = reviewedReportTimes.Any()
                ? (long)reviewedReportTimes.Average()
                : 0;

            return new ReportStatisticsResponse
            {
                Reports = new ReportStats
                {
                    TotalReports = totalReports,
                    PendingReports = pendingReports,
                    ResolvedReports = reviewedReports,
                    DismissedReports = closedReports,
                    NewReportsToday = await _context.Reports.CountAsync(r => r.CreatedAt.Date == DateTime.UtcNow.Date)
                },
                ReportsByReason = reportsByReason,
                ReportsByStatus = reportsByStatus,
                ReportTrend = reportTrend
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching report statistics");
            return new ReportStatisticsResponse();
        }
    }
    private AdminReportResponse MapToAdminReportResponse(Report report)
    {
        var response = new AdminReportResponse
        {
            Id = report.Id,
            Reason = report.Reason,
            Description = report.Description ?? string.Empty,
            Status = report.Status,
            CreatedAt = report.CreatedAt,
            ResolvedAt = report.UpdatedAt
        };

        if (report.Reporter != null)
        {
            response.Reporter = MapToAdminUserResponse(report.Reporter);
        }

        if (report.ReportedUser != null)
        {
            response.ReportedUser = MapToAdminUserResponse(report.ReportedUser);
        }

        return response;
    }

    private AdminUserResponse MapToAdminUserResponse(User user)
    {
        return new AdminUserResponse
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            ProfilePic = user.ProfilePic ?? string.Empty,
            Role = user.Role,
            IsActive = user.IsActive
        };
    }
}