package com.socialmedia.service;

import com.socialmedia.common.enums.FollowStatus;
import com.socialmedia.common.enums.ReportStatus;
import com.socialmedia.dto.request.ReportRequest;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.ReportResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.entity.Comment;
import com.socialmedia.entity.Post;
import com.socialmedia.entity.Report;
import com.socialmedia.entity.User;
import com.socialmedia.exception.BadRequestException;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.repository.CommentRepository;
import com.socialmedia.repository.FollowRepository;
import com.socialmedia.repository.PostRepository;
import com.socialmedia.repository.ReportRepository;
import com.socialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;
    private final UserService userService;

    @Transactional
    public void reportUser(Long userId, ReportRequest request) {
        User reporter = userService.getCurrentUser();
        User reportedUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (reporter.getId().equals(reportedUser.getId())) {
            throw new BadRequestException("You cannot report yourself");
        }

        // Check if already reported
        if (reportRepository.existsByReporterAndReportedUserAndStatus(reporter, reportedUser, ReportStatus.PENDING)) {
            throw new BadRequestException("You have already reported this user");
        }

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedUser(reportedUser);
        report.setReason(request.getReason());
        report.setDescription(request.getDescription());
        report.setStatus(ReportStatus.PENDING);

        reportRepository.save(report);
        log.info("User {} reported by {}", reportedUser.getUsername(), reporter.getUsername());
    }

    @Transactional
    public void reportPost(Long postId, ReportRequest request) {
        User reporter = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setPost(post);
        report.setReason(request.getReason());
        report.setDescription(request.getDescription());
        report.setStatus(ReportStatus.PENDING);

        reportRepository.save(report);
        log.info("Post {} reported by user {}", postId, reporter.getUsername());
    }

    @Transactional
    public void reportComment(Long commentId, ReportRequest request) {
        User reporter = userService.getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setComment(comment);
        report.setReason(request.getReason());
        report.setDescription(request.getDescription());
        report.setStatus(ReportStatus.PENDING);

        reportRepository.save(report);
        log.info("Comment {} reported by user {}", commentId, reporter.getUsername());
    }

    @Transactional(readOnly = true)
    public PageResponse<ReportResponse> getUserReports(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports = reportRepository.findByReporterOrderByCreatedAtDesc(currentUser, pageable);

        List<ReportResponse> reportResponses = reports.getContent().stream()
            .map(this::mapToReportResponse)
            .collect(Collectors.toList());

        return PageResponse.<ReportResponse>builder()
            .content(reportResponses)
            .pageNumber(reports.getNumber())
            .pageSize(reports.getSize())
            .totalElements(reports.getTotalElements())
            .totalPages(reports.getTotalPages())
            .last(reports.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long reportId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        
        User currentUser = userService.getCurrentUser();
        if (!report.getReporter().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have access to this report");
        }
        
        return mapToReportResponse(report);
    }

    /**
     * Map Report entity to ReportResponse DTO manually to avoid LazyInitializationException
     */
    private ReportResponse mapToReportResponse(Report report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setReason(report.getReason());
        response.setDescription(report.getDescription());
        response.setStatus(report.getStatus());
        response.setCreatedAt(report.getCreatedAt());
        response.setUpdatedAt(report.getUpdatedAt());
        
        // Map reporter
        User reporter = report.getReporter();
        response.setReporter(mapToUserResponse(reporter));
        
        // Map reported user if exists
        if (report.getReportedUser() != null) {
            response.setReportedUser(mapToUserResponse(report.getReportedUser()));
        }
        
        // Map post if exists
        if (report.getPost() != null) {
            Post post = report.getPost();
            // Simplified post response - you can expand this if needed
            com.socialmedia.dto.response.PostResponse postResponse = new com.socialmedia.dto.response.PostResponse();
            postResponse.setId(post.getId());
            postResponse.setContent(post.getContent());
            postResponse.setMediaUrl(post.getMediaUrl());
            postResponse.setMediaType(post.getMediaType());
            postResponse.setCreatedAt(post.getCreatedAt());
            postResponse.setUpdatedAt(post.getUpdatedAt());
            postResponse.setUser(mapToUserResponse(post.getUser()));
            response.setPost(postResponse);
        }
        
        // Map comment if exists
        if (report.getComment() != null) {
            Comment comment = report.getComment();
            com.socialmedia.dto.response.CommentResponse commentResponse = 
                new com.socialmedia.dto.response.CommentResponse();
            commentResponse.setId(comment.getId());
            commentResponse.setContent(comment.getContent());
            commentResponse.setEdited(comment.isEdited());
            commentResponse.setCreatedAt(comment.getCreatedAt());
            commentResponse.setUpdatedAt(comment.getUpdatedAt());
            commentResponse.setUser(mapToUserResponse(comment.getUser()));
            response.setComment(commentResponse);
        }
        
        return response;
    }

    /**
     * Map User entity to UserResponse DTO manually
     */
    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setBio(user.getBio());
        response.setProfilePic(user.getProfilePic());
        response.setPrivate(user.isPrivate());
        response.setActive(user.isActive());
        response.setLastSeen(user.getLastSeen());
        response.setFollowersCount(followRepository.countByFollowingAndStatus(user, FollowStatus.ACCEPTED));
        response.setFollowingCount(followRepository.countByFollowerAndStatus(user, FollowStatus.ACCEPTED));
        return response;
    }
}