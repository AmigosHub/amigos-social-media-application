package com.socialmedia.controller;

import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/posts/{postId}")
    public ApiResponse<Void> likePost(@PathVariable Long postId) {
        likeService.likePost(postId);
        return ApiResponse.success("Post liked");
    }

    @DeleteMapping("/posts/{postId}")
    public ApiResponse<Void> unlikePost(@PathVariable Long postId) {
        likeService.unlikePost(postId);
        return ApiResponse.success("Post unliked");
    }

    @GetMapping("/posts/{postId}/count")
    public ApiResponse<Long> getLikeCount(@PathVariable Long postId) {
        return ApiResponse.success("Like count retrieved", likeService.getPostLikeCount(postId));
    }

    @GetMapping("/posts/{postId}/is-liked")
    public ApiResponse<Boolean> isLiked(@PathVariable Long postId) {
        return ApiResponse.success("Like status retrieved", likeService.isLikedByCurrentUser(postId));
    }

    @GetMapping("/posts/{postId}")
    public ApiResponse<PageResponse<UserResponse>> getPostLikes(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Post likes retrieved", likeService.getPostLikes(postId, page, size));
    }
}