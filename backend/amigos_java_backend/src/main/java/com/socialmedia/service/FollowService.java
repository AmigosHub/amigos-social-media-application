package com.socialmedia.service;

import com.socialmedia.common.enums.FollowStatus;
import com.socialmedia.common.enums.NotificationType;
import com.socialmedia.dto.response.FollowRequestResponse;
import com.socialmedia.dto.response.FollowStatusResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.entity.Follow;
import com.socialmedia.entity.Notification;
import com.socialmedia.entity.User;
import com.socialmedia.exception.BadRequestException;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.repository.BlockedUserRepository;
import com.socialmedia.repository.FollowRepository;
import com.socialmedia.repository.NotificationRepository;
import com.socialmedia.repository.PostRepository;
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
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final NotificationRepository notificationRepository;
    private final PostRepository postRepository;
    private final UserService userService;

    @Transactional
    public void followUser(Long userId) {
        User currentUser = userService.getCurrentUser();
        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new BadRequestException("You cannot follow yourself");
        }

        // Check if blocked
        if (blockedUserRepository.existsByBlockerAndBlockedUser(currentUser, targetUser)) {
            throw new BadRequestException("You have blocked this user");
        }
        if (blockedUserRepository.existsByBlockerAndBlockedUser(targetUser, currentUser)) {
            throw new BadRequestException("You are blocked by this user");
        }

        // Check if already following
        if (followRepository.existsByFollowerAndFollowingAndStatus(currentUser, targetUser, FollowStatus.ACCEPTED)) {
            throw new BadRequestException("Already following this user");
        }

        // Check if there's a pending request
        if (followRepository.existsByFollowerAndFollowingAndStatus(currentUser, targetUser, FollowStatus.PENDING)) {
            throw new BadRequestException("Follow request already pending");
        }

        Follow follow = new Follow();
        follow.setFollower(currentUser);
        follow.setFollowing(targetUser);

        // If target user has private account, request is pending; otherwise accepted
        if (targetUser.isPrivate()) {
            follow.setStatus(FollowStatus.PENDING);

            // Create notification for follow request
            Notification notification = new Notification();
            notification.setReceiver(targetUser);
            notification.setSender(currentUser);
            notification.setType(NotificationType.FOLLOW_REQUEST);
            notification.setMessage(currentUser.getFullName() + " sent you a follow request");
            notificationRepository.save(notification);
        } else {
            follow.setStatus(FollowStatus.ACCEPTED);

            // Create notification for new follower
            Notification notification = new Notification();
            notification.setReceiver(targetUser);
            notification.setSender(currentUser);
            notification.setType(NotificationType.NEW_FOLLOWER);
            notification.setMessage(currentUser.getFullName() + " started following you");
            notificationRepository.save(notification);
        }

        followRepository.save(follow);
        log.info("User {} followed user {}", currentUser.getUsername(), targetUser.getUsername());
    }

    @Transactional
    public void unfollowUser(Long userId) {
        User currentUser = userService.getCurrentUser();
        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        followRepository.deleteByFollowerAndFollowing(currentUser, targetUser);
        log.info("User {} unfollowed user {}", currentUser.getUsername(), targetUser.getUsername());
    }

    @Transactional
    public void acceptFollowRequest(Long followId) {
        User currentUser = userService.getCurrentUser();
        Follow follow = followRepository.findById(followId)
            .orElseThrow(() -> new ResourceNotFoundException("Follow request not found"));

        if (!follow.getFollowing().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You cannot accept this request");
        }

        if (follow.getStatus() != FollowStatus.PENDING) {
            throw new BadRequestException("This request is already processed");
        }

        follow.setStatus(FollowStatus.ACCEPTED);
        followRepository.save(follow);

        // Create notification for follow accepted
        Notification notification = new Notification();
        notification.setReceiver(follow.getFollower());
        notification.setSender(currentUser);
        notification.setType(NotificationType.FOLLOW_ACCEPTED);
        notification.setMessage(currentUser.getFullName() + " accepted your follow request");
        notificationRepository.save(notification);

        log.info("Follow request {} accepted by user {}", followId, currentUser.getUsername());
    }

    @Transactional
    public void rejectFollowRequest(Long followId) {
        User currentUser = userService.getCurrentUser();
        Follow follow = followRepository.findById(followId)
            .orElseThrow(() -> new ResourceNotFoundException("Follow request not found"));

        if (!follow.getFollowing().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You cannot reject this request");
        }

        if (follow.getStatus() != FollowStatus.PENDING) {
            throw new BadRequestException("This request is already processed");
        }

        follow.setStatus(FollowStatus.REJECTED);
        followRepository.save(follow);
        log.info("Follow request {} rejected by user {}", followId, currentUser.getUsername());
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getFollowers(Long userId, int page, int size) {
        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Follow> followers = followRepository.findFollowers(targetUser, pageable);

        List<UserResponse> userResponses = followers.getContent().stream()
            .map(follow -> mapToUserResponse(follow.getFollower()))
            .collect(Collectors.toList());

        return PageResponse.<UserResponse>builder()
            .content(userResponses)
            .pageNumber(followers.getNumber())
            .pageSize(followers.getSize())
            .totalElements(followers.getTotalElements())
            .totalPages(followers.getTotalPages())
            .last(followers.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getFollowing(Long userId, int page, int size) {
        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Follow> following = followRepository.findFollowing(targetUser, pageable);

        List<UserResponse> userResponses = following.getContent().stream()
            .map(follow -> mapToUserResponse(follow.getFollowing()))
            .collect(Collectors.toList());

        return PageResponse.<UserResponse>builder()
            .content(userResponses)
            .pageNumber(following.getNumber())
            .pageSize(following.getSize())
            .totalElements(following.getTotalElements())
            .totalPages(following.getTotalPages())
            .last(following.isLast())
            .build();
    }

//    @Transactional(readOnly = true)
//    public PageResponse<UserResponse> getPendingFollowRequests(int page, int size) {
//        User currentUser = userService.getCurrentUser();
//        Pageable pageable = PageRequest.of(page, size);
//        Page<Follow> pending = followRepository.findPendingFollowRequests(currentUser, pageable);
//
//        List<UserResponse> userResponses = pending.getContent().stream()
//            .map(follow -> mapToUserResponse(follow.getFollower()))
//            .collect(Collectors.toList());
//
//        return PageResponse.<UserResponse>builder()
//            .content(userResponses)
//            .pageNumber(pending.getNumber())
//            .pageSize(pending.getSize())
//            .totalElements(pending.getTotalElements())
//            .totalPages(pending.getTotalPages())
//            .last(pending.isLast())
//            .build();
//    }
    
    @Transactional(readOnly = true)
    public PageResponse<FollowRequestResponse> getPendingFollowRequests(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Follow> pending = followRepository.findPendingFollowRequests(currentUser, pageable);

        List<FollowRequestResponse> followRequestResponses = pending.getContent().stream()
            .map(this::mapToFollowRequestResponse)
            .collect(Collectors.toList());

        return PageResponse.<FollowRequestResponse>builder()
            .content(followRequestResponses)
            .pageNumber(pending.getNumber())
            .pageSize(pending.getSize())
            .totalElements(pending.getTotalElements())
            .totalPages(pending.getTotalPages())
            .last(pending.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public FollowStatusResponse getFollowStatus(Long userId) {
        User currentUser = userService.getCurrentUser();
        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        boolean isFollowing = followRepository.existsByFollowerAndFollowingAndStatus(
            currentUser, targetUser, FollowStatus.ACCEPTED);
        boolean isFollowedBy = followRepository.existsByFollowerAndFollowingAndStatus(
            targetUser, currentUser, FollowStatus.ACCEPTED);
        boolean hasPendingRequest = followRepository.existsByFollowerAndFollowingAndStatus(
            currentUser, targetUser, FollowStatus.PENDING);
        boolean isBlocked = blockedUserRepository.existsByBlockerAndBlockedUser(currentUser, targetUser);
        boolean isBlockedBy = blockedUserRepository.existsByBlockerAndBlockedUser(targetUser, currentUser);
        
        return FollowStatusResponse.builder()
            .isFollowing(isFollowing)
            .isFollowedBy(isFollowedBy)
            .hasPendingRequest(hasPendingRequest)
            .isBlocked(isBlocked)
            .isBlockedBy(isBlockedBy)
            .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getFollowSuggestions(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        
        // Get users that current user follows
        List<User> followingUsers = followRepository.findFollowingUsers(currentUser);
        List<Long> followingIds = followingUsers.stream()
            .map(User::getId)
            .collect(Collectors.toList());
        
        // Add current user to exclude
        followingIds.add(currentUser.getId());
        
        // Get users not followed and not blocked
        Page<User> suggestions = userRepository.findUsersNotInListAndNotBlocked(
            followingIds, currentUser.getId(), pageable);
        
        List<UserResponse> userResponses = suggestions.getContent().stream()
            .map(this::mapToUserResponse)
            .collect(Collectors.toList());
        
        return PageResponse.<UserResponse>builder()
            .content(userResponses)
            .pageNumber(suggestions.getNumber())
            .pageSize(suggestions.getSize())
            .totalElements(suggestions.getTotalElements())
            .totalPages(suggestions.getTotalPages())
            .last(suggestions.isLast())
            .build();
    }
    
    // ============ NEW MAPPING METHOD ============
    /**
     * Map Follow entity to FollowRequestResponse DTO
     * This includes the follow request ID (follow.getId()) which is needed to accept/reject requests
     */
    private FollowRequestResponse mapToFollowRequestResponse(Follow follow) {
        FollowRequestResponse response = new FollowRequestResponse();
        response.setFollowRequestId(follow.getId());  // This is the follow request ID
        response.setUser(mapToUserResponse(follow.getFollower()));
        response.setStatus(follow.getStatus());
        response.setCreatedAt(follow.getCreatedAt());
        return response;
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
            User currentUser = userService.getCurrentUser();
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
}