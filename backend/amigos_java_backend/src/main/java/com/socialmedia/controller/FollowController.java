package com.socialmedia.controller;

import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.FollowRequestResponse;
import com.socialmedia.dto.response.FollowStatusResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{userId}")
    public ApiResponse<Void> followUser(@PathVariable Long userId) {
        followService.followUser(userId);
        return ApiResponse.success("Follow request sent");
    }

    @DeleteMapping("/{userId}")
    public ApiResponse<Void> unfollowUser(@PathVariable Long userId) {
        followService.unfollowUser(userId);
        return ApiResponse.success("Unfollowed successfully");
    }

    @PutMapping("/requests/{followId}/accept")
    public ApiResponse<Void> acceptFollowRequest(@PathVariable Long followId) {
        followService.acceptFollowRequest(followId);
        return ApiResponse.success("Follow request accepted");
    }

    @DeleteMapping("/requests/{followId}/reject")
    public ApiResponse<Void> rejectFollowRequest(@PathVariable Long followId) {
        followService.rejectFollowRequest(followId);
        return ApiResponse.success("Follow request rejected");
    }

    @GetMapping("/users/{userId}/followers")
    public ApiResponse<PageResponse<UserResponse>> getFollowers(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Followers retrieved", followService.getFollowers(userId, page, size));
    }

    @GetMapping("/users/{userId}/following")
    public ApiResponse<PageResponse<UserResponse>> getFollowing(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Following retrieved", followService.getFollowing(userId, page, size));
    }

//    @GetMapping("/requests/pending")
//    public ApiResponse<PageResponse<UserResponse>> getPendingRequests(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size) {
//        return ApiResponse.success("Pending requests retrieved", followService.getPendingFollowRequests(page, size));
//    }
    
    @GetMapping("/requests/pending")
    public ApiResponse<PageResponse<FollowRequestResponse>> getPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Pending requests retrieved", followService.getPendingFollowRequests(page, size));
    }

    @GetMapping("/status/{userId}")
    public ApiResponse<FollowStatusResponse> getFollowStatus(@PathVariable Long userId) {
        return ApiResponse.success("Follow status retrieved", followService.getFollowStatus(userId));
    }

    @GetMapping("/suggestions")
    public ApiResponse<PageResponse<UserResponse>> getFollowSuggestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Follow suggestions retrieved", followService.getFollowSuggestions(page, size));
    }
}