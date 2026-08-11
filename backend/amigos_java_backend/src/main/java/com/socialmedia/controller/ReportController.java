package com.socialmedia.controller;

import com.socialmedia.dto.request.ReportRequest;
import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.ReportResponse;
import com.socialmedia.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/users/{userId}")
    public ApiResponse<Void> reportUser(
            @PathVariable Long userId,
            @Valid @RequestBody ReportRequest request) {
        reportService.reportUser(userId, request);
        return ApiResponse.success("User reported");
    }

    @PostMapping("/posts/{postId}")
    public ApiResponse<Void> reportPost(
            @PathVariable Long postId,
            @Valid @RequestBody ReportRequest request) {
        reportService.reportPost(postId, request);
        return ApiResponse.success("Post reported");
    }

    @PostMapping("/comments/{commentId}")
    public ApiResponse<Void> reportComment(
            @PathVariable Long commentId,
            @Valid @RequestBody ReportRequest request) {
        reportService.reportComment(commentId, request);
        return ApiResponse.success("Comment reported");
    }

    @GetMapping
    public ApiResponse<PageResponse<ReportResponse>> getReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Reports retrieved", reportService.getUserReports(page, size));
    }

    @GetMapping("/me")
    public ApiResponse<PageResponse<ReportResponse>> getMyReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("My reports retrieved", reportService.getUserReports(page, size));
    }

    @GetMapping("/{reportId}")
    public ApiResponse<ReportResponse> getReportById(@PathVariable Long reportId) {
        return ApiResponse.success("Report retrieved", reportService.getReportById(reportId));
    }
}