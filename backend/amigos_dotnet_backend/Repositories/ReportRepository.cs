using Microsoft.EntityFrameworkCore;
using SocialMediaAdminBackend.Data;
using SocialMediaAdminBackend.Models.DTOs.Response;
using SocialMediaAdminBackend.Models.Entities;

namespace SocialMediaAdminBackend.Repositories;

public class ReportRepository
{
    private readonly ApplicationDbContext _context;

    public ReportRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    // Existing methods...

    public async Task<List<Report>> GetPendingReportsAsync()
    {
        return await _context.Reports
            .Include(r => r.Reporter)
            .Include(r => r.ReportedUser)
            .Where(r => r.Status == "PENDING")
            .OrderBy(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<ReportStatisticsResponse> GetReportStatisticsAsync()
    {
        var totalReports = await _context.Reports.CountAsync();
        var pendingReports = await _context.Reports.CountAsync(r => r.Status == "PENDING");
        var resolvedReports = await _context.Reports.CountAsync(r => r.Status == "RESOLVED");
        var dismissedReports = await _context.Reports.CountAsync(r => r.Status == "DISMISSED");

        // Reports by reason
        var reportsByReason = await _context.Reports
            .GroupBy(r => r.Reason)
            .Select(g => new ReportByReason
            {
                Reason = g.Key,
                Count = g.Count(),
                Percentage = totalReports > 0 ? (double)g.Count() / totalReports * 100 : 0
            })
            .ToListAsync();

        // Reports by status
        var reportsByStatus = new List<ReportByStatus>
        {
            new ReportByStatus { Status = "PENDING", Count = pendingReports, Percentage = totalReports > 0 ? (double)pendingReports / totalReports * 100 : 0 },
            new ReportByStatus { Status = "RESOLVED", Count = resolvedReports, Percentage = totalReports > 0 ? (double)resolvedReports / totalReports * 100 : 0 },
            new ReportByStatus { Status = "DISMISSED", Count = dismissedReports, Percentage = totalReports > 0 ? (double)dismissedReports / totalReports * 100 : 0 }
        };

        // Report trend (last 30 days)
        var startDate = DateTime.UtcNow.AddDays(-30);
        var reportTrend = await _context.Reports
            .Where(r => r.CreatedAt >= startDate)
            .GroupBy(r => r.CreatedAt.Date)
            .Select(g => new ReportTrend
            {
                Date = g.Key,
                NewReports = g.Count(),
                ResolvedReports = g.Count(r => r.Status == "RESOLVED")
            })
            .OrderBy(r => r.Date)
            .ToListAsync();

        return new ReportStatisticsResponse
        {
            Reports = new ReportStats
            {
                TotalReports = totalReports,
                PendingReports = pendingReports,
                ResolvedReports = resolvedReports,
                DismissedReports = dismissedReports
            },
            ReportsByReason = reportsByReason,
            ReportsByStatus = reportsByStatus,
            ReportTrend = reportTrend
        };
    }
}