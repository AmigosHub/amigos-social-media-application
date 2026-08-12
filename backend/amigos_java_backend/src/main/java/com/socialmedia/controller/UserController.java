package com.socialmedia.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.socialmedia.dto.request.SettingsRequest;
import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.PostResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.dto.response.UserSettingsResponse;
import com.socialmedia.service.PostService;
import com.socialmedia.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final PostService postService;
    private final Cloudinary cloudinary;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser() {
        return ApiResponse.success("User profile retrieved", userService.getCurrentUserProfile());
    }

    @GetMapping("/{userId}")
    public ApiResponse<UserResponse> getUserProfile(@PathVariable Long userId) {
        return ApiResponse.success("User profile retrieved", userService.getUserProfile(userId));
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> updateProfile(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String bio) {
        return ApiResponse.success("Profile updated", userService.updateProfile(fullName, bio));
    }

    @PostMapping(value = "/me/profile-pic", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<String> updateProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file == null || file.isEmpty()) {
                return ApiResponse.error("File is required");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ApiResponse.error("Only image files are allowed");
            }

            // Validate file size (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ApiResponse.error("File size exceeds 5MB limit");
            }

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "social_media/profiles",
                    "resource_type", "image",
                    "width", 500,
                    "height", 500,
                    "crop", "fill",
                    "gravity", "face",
                    "quality", "auto:best"
                )
            );
            
            String imageUrl = uploadResult.get("secure_url").toString();
            log.info("Profile picture uploaded successfully: {}", imageUrl);

            // Update user profile with the new image URL
            String savedUrl = userService.updateProfilePicture(imageUrl);
            return ApiResponse.success("Profile picture updated successfully", savedUrl);

        } catch (IOException e) {
            log.error("Failed to upload profile picture", e);
            return ApiResponse.error("Failed to upload image: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while uploading profile picture", e);
            return ApiResponse.error("An unexpected error occurred: " + e.getMessage());
        }
    }

    @DeleteMapping("/me/profile-pic")
    public ApiResponse<Void> removeProfilePicture() {
        userService.removeProfilePicture();
        return ApiResponse.success("Profile picture removed successfully");
    }

    @PostMapping("/me/change-password")
    public ApiResponse<Void> changePassword(
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        userService.changePassword(oldPassword, newPassword);
        return ApiResponse.success("Password changed successfully");
    }

    @DeleteMapping("/me/deactivate")
    public ApiResponse<Void> deactivateAccount() {
        userService.deactivateAccount();
        return ApiResponse.success("Account deactivated successfully");
    }

    @GetMapping("/me/posts")
    public ApiResponse<PageResponse<PostResponse>> getMyPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UserResponse currentUser = userService.getCurrentUserProfile();
        return ApiResponse.success("My posts retrieved", postService.getUserPosts(currentUser.getId(), page, size));
    }

    @PatchMapping("/me/privacy")
    public ApiResponse<UserResponse> updatePrivacy(@RequestParam boolean isPrivate) {
        return ApiResponse.success("Privacy updated", userService.updatePrivacy(isPrivate));
    }

    @PatchMapping("/me/account-status")
    public ApiResponse<UserResponse> updateAccountStatus(@RequestParam boolean isActive) {
        return ApiResponse.success("Account status updated", userService.updateAccountStatus(isActive));
    }

    @GetMapping("/search")
    public ApiResponse<PageResponse<UserResponse>> searchUsers(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Search results", userService.searchUsers(q, page, size));
    }

    @GetMapping("/me/settings")
    public ApiResponse<UserSettingsResponse> getSettings() {
        return ApiResponse.success("Settings retrieved", userService.getSettings());
    }

    @PutMapping("/me/settings")
    public ApiResponse<UserSettingsResponse> updateSettings(@Valid @RequestBody SettingsRequest request) {
        return ApiResponse.success("Settings updated", userService.updateSettings(request));
    }
}