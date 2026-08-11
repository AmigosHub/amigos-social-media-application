package com.socialmedia.controller;

import com.socialmedia.dto.request.PostRequest;
import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.CommentResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.PostResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.service.CommentService;
import com.socialmedia.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<PostResponse> createPost(@Valid @ModelAttribute PostRequest request) {
        return ApiResponse.success("Post created", postService.createPost(request));
    }

    @GetMapping("/feed")
    public ApiResponse<PageResponse<PostResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Feed retrieved", postService.getFeed(page, size));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<PageResponse<PostResponse>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("User posts retrieved", postService.getUserPosts(userId, page, size));
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPost(@PathVariable Long postId) {
        return ApiResponse.success("Post retrieved", postService.getPost(postId));
    }

    @GetMapping("/{postId}/likes")
    public ApiResponse<PageResponse<UserResponse>> getPostLikes(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Post likes retrieved", postService.getPostLikes(postId, page, size));
    }

    @GetMapping("/{postId}/comments")
    public ApiResponse<PageResponse<CommentResponse>> getPostComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Post comments retrieved", commentService.getPostComments(postId, page, size));
    }

    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<PostResponse> updatePost(
            @PathVariable Long postId,
            @Valid @ModelAttribute PostRequest request) {
        return ApiResponse.success("Post updated", postService.updatePost(postId, request));
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ApiResponse.success("Post deleted");
    }
}