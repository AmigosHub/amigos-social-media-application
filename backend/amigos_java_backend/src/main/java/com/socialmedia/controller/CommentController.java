package com.socialmedia.controller;

import com.socialmedia.dto.request.CommentRequest;
import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.CommentResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/posts/{postId}")
    public ApiResponse<CommentResponse> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request) {
        return ApiResponse.success("Comment created", commentService.createComment(request, postId));
    }

    @PutMapping("/{commentId}")
    public ApiResponse<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @RequestParam String content) {
        return ApiResponse.success("Comment updated", commentService.updateComment(commentId, content));
    }

    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ApiResponse.success("Comment deleted");
    }

    @GetMapping("/posts/{postId}")
    public ApiResponse<PageResponse<CommentResponse>> getPostComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Comments retrieved", commentService.getPostComments(postId, page, size));
    }

    @GetMapping("/{commentId}/replies")
    public ApiResponse<PageResponse<CommentResponse>> getCommentReplies(
            @PathVariable Long commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Replies retrieved", commentService.getCommentReplies(commentId, page, size));
    }

    @PostMapping("/{commentId}/replies")
    public ApiResponse<CommentResponse> createReply(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request) {
        return ApiResponse.success("Reply created", commentService.createReply(commentId, request));
    }

    @PutMapping("/replies/{replyId}")
    public ApiResponse<CommentResponse> updateReply(
            @PathVariable Long replyId,
            @RequestParam String content) {
        return ApiResponse.success("Reply updated", commentService.updateComment(replyId, content));
    }

    @DeleteMapping("/replies/{replyId}")
    public ApiResponse<Void> deleteReply(@PathVariable Long replyId) {
        commentService.deleteComment(replyId);
        return ApiResponse.success("Reply deleted");
    }
}