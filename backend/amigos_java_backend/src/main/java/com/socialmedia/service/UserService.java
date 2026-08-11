package com.socialmedia.service;

import com.socialmedia.dto.request.SettingsRequest;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.dto.response.UserSettingsResponse;
import com.socialmedia.entity.User;
import com.socialmedia.entity.UserSettings;
import com.socialmedia.exception.BadRequestException;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.repository.*;
import com.socialmedia.common.enums.FollowStatus;
import com.socialmedia.common.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Long userId = securityUtils.getCurrentUserId();
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile() {
        User user = getCurrentUser();
        return mapToUserResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("User is not active");
        }

        // Check if blocked
        User currentUser = getCurrentUser();
        if (blockedUserRepository.existsByBlockerAndBlockedUser(currentUser, user)) {
            throw new BadRequestException("You have blocked this user");
        }
        if (blockedUserRepository.existsByBlockerAndBlockedUser(user, currentUser)) {
            throw new BadRequestException("You are blocked by this user");
        }

        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String fullName, String bio) {
        User user = getCurrentUser();

        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }

        if (bio != null) {
            user.setBio(bio);
        }

        User updatedUser = userRepository.save(user);
        log.info("Profile updated for user: {}", user.getUsername());
        return mapToUserResponse(updatedUser);
    }

    @Transactional
    public String updateProfilePicture(String imageUrl) {
        User user = getCurrentUser();
        user.setProfilePic(imageUrl);
        userRepository.save(user);
        log.info("Profile picture updated for user: {}", user.getUsername());
        return imageUrl;
    }

    @Transactional
    public void removeProfilePicture() {
        User user = getCurrentUser();
        user.setProfilePic(null);
        userRepository.save(user);
        log.info("Profile picture removed for user: {}", user.getUsername());
    }

    @Transactional
    public void changePassword(String oldPassword, String newPassword) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getUsername());
    }

    @Transactional
    public void deactivateAccount() {
        User user = getCurrentUser();
        user.setActive(false);
        userRepository.save(user);
        log.info("Account deactivated for user: {}", user.getUsername());
    }

    @Transactional
    public UserResponse updatePrivacy(boolean isPrivate) {
        User user = getCurrentUser();
        user.setPrivate(isPrivate);
        User updatedUser = userRepository.save(user);
        log.info("Privacy updated for user {}: {}", user.getUsername(), isPrivate ? "PRIVATE" : "PUBLIC");
        return mapToUserResponse(updatedUser);
    }

    @Transactional
    public UserResponse updateAccountStatus(boolean isActive) {
        User user = getCurrentUser();
        user.setActive(isActive);
        User updatedUser = userRepository.save(user);
        log.info("Account status updated for user {}: {}", user.getUsername(), isActive ? "ACTIVE" : "INACTIVE");
        return mapToUserResponse(updatedUser);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> searchUsers(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.searchUsers(query, pageable);

        List<UserResponse> userResponses = users.getContent().stream()
            .map(this::mapToUserResponse)
            .collect(Collectors.toList());

        return PageResponse.<UserResponse>builder()
            .content(userResponses)
            .pageNumber(users.getNumber())
            .pageSize(users.getSize())
            .totalElements(users.getTotalElements())
            .totalPages(users.getTotalPages())
            .last(users.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public UserSettingsResponse getSettings() {
        User user = getCurrentUser();
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Settings not found"));
        return mapToSettingsResponse(settings);
    }

    @Transactional
    public UserSettingsResponse updateSettings(SettingsRequest request) {
        User user = getCurrentUser();
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Settings not found"));

        if (request.getEmailNotifications() != null) {
            settings.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getMessageNotifications() != null) {
            settings.setMessageNotifications(request.getMessageNotifications());
        }
        if (request.getPushNotifications() != null) {
            settings.setPushNotifications(request.getPushNotifications());
        }
        if (request.getAccountVisibility() != null) {
            settings.setAccountVisibility(request.getAccountVisibility());
            user.setPrivate("PRIVATE".equals(request.getAccountVisibility()));
        }
        if (request.getLanguage() != null) {
            settings.setLanguage(request.getLanguage());
        }
        if (request.getTheme() != null) {
            settings.setTheme(request.getTheme());
        }

        userRepository.save(user);
        UserSettings updatedSettings = userSettingsRepository.save(settings);
        log.info("Settings updated for user: {}", user.getUsername());
        return mapToSettingsResponse(updatedSettings);
    }

    /**
     * Map User entity to UserResponse DTO manually to avoid LazyInitializationException
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
        
        // Calculate counts from database
        response.setFollowersCount(followRepository.countByFollowingAndStatus(user, FollowStatus.ACCEPTED));
        response.setFollowingCount(followRepository.countByFollowerAndStatus(user, FollowStatus.ACCEPTED));
        response.setPostsCount(postRepository.countByUser(user));
        
        // Check follow status for current user
        try {
            User currentUser = getCurrentUser();
            if (currentUser != null && !currentUser.getId().equals(user.getId())) {
                boolean isFollowing = followRepository.existsByFollowerAndFollowingAndStatus(
                    currentUser, user, FollowStatus.ACCEPTED);
                boolean isFollowedBy = followRepository.existsByFollowerAndFollowingAndStatus(
                    user, currentUser, FollowStatus.ACCEPTED);
                response.setFollowedByCurrentUser(isFollowing);
                response.setFollowingCurrentUser(isFollowedBy);
            }
        } catch (Exception e) {
            // If no authenticated user, ignore follow status
            log.debug("Could not determine follow status for user: {}", user.getId());
        }
        
        return response;
    }

    /**
     * Map UserSettings entity to UserSettingsResponse DTO
     */
    private UserSettingsResponse mapToSettingsResponse(UserSettings settings) {
        return UserSettingsResponse.builder()
            .userId(settings.getUserId())
            .emailNotifications(settings.isEmailNotifications())
            .messageNotifications(settings.isMessageNotifications())
            .pushNotifications(settings.isPushNotifications())
            .accountVisibility(settings.getAccountVisibility())
            .language(settings.getLanguage())
            .theme(settings.getTheme())
            .build();
    }
}