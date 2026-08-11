package com.socialmedia.controller;

import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.PostResponse;
import com.socialmedia.service.SavedPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saved-posts")
@RequiredArgsConstructor
public class SavedPostController {

    private final SavedPostService savedPostService;

    @PostMapping("/posts/{postId}")
    public ApiResponse<Void> savePost(@PathVariable Long postId) {
        savedPostService.savePost(postId);
        return ApiResponse.success("Post saved");
    }

    @DeleteMapping("/posts/{postId}")
    public ApiResponse<Void> unsavePost(@PathVariable Long postId) {
        savedPostService.unsavePost(postId);
        return ApiResponse.success("Post unsaved");
    }

    @GetMapping
    public ApiResponse<PageResponse<PostResponse>> getSavedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Saved posts retrieved", savedPostService.getSavedPosts(page, size));
    }

    @GetMapping("/posts/{postId}/is-saved")
    public ApiResponse<Boolean> isSaved(@PathVariable Long postId) {
        return ApiResponse.success("Save status retrieved", savedPostService.isSavedByCurrentUser(postId));
    }
}