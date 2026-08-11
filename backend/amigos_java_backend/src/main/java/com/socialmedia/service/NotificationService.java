package com.socialmedia.service;

import com.socialmedia.common.enums.FollowStatus;
import com.socialmedia.dto.response.NotificationResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.entity.Notification;
import com.socialmedia.entity.User;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.repository.FollowRepository;
import com.socialmedia.repository.NotificationRepository;
import com.socialmedia.repository.PostRepository;
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
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final FollowRepository followRepository;
    private final PostRepository postRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getNotifications(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByReceiverOrderByCreatedAtDesc(currentUser, pageable);

        List<NotificationResponse> notificationResponses = notifications.getContent().stream()
            .map(this::mapToNotificationResponse)
            .collect(Collectors.toList());

        return PageResponse.<NotificationResponse>builder()
            .content(notificationResponses)
            .pageNumber(notifications.getNumber())
            .pageSize(notifications.getSize())
            .totalElements(notifications.getTotalElements())
            .totalPages(notifications.getTotalPages())
            .last(notifications.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getUnreadNotifications(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findUnreadByReceiver(currentUser, pageable);

        List<NotificationResponse> notificationResponses = notifications.getContent().stream()
            .map(this::mapToNotificationResponse)
            .collect(Collectors.toList());

        return PageResponse.<NotificationResponse>builder()
            .content(notificationResponses)
            .pageNumber(notifications.getNumber())
            .pageSize(notifications.getSize())
            .totalElements(notifications.getTotalElements())
            .totalPages(notifications.getTotalPages())
            .last(notifications.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public NotificationResponse getNotification(Long notificationId) {
        User currentUser = userService.getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getReceiver().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have access to this notification");
        }
        
        return mapToNotificationResponse(notification);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        User currentUser = userService.getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getReceiver().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to access this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        log.info("Notification {} marked as read for user {}", notificationId, currentUser.getUsername());
    }

    @Transactional
    public void markAllAsRead() {
        User currentUser = userService.getCurrentUser();
        notificationRepository.markAllAsRead(currentUser);
        log.info("All notifications marked as read for user {}", currentUser.getUsername());
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        User currentUser = userService.getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getReceiver().getId().equals(currentUser.getId())) {
            throw new SecurityException("You don't have permission to delete this notification");
        }

        notificationRepository.delete(notification);
        log.info("Notification {} deleted for user {}", notificationId, currentUser.getUsername());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.countByReceiverAndIsReadFalse(currentUser);
    }

    /**
     * Map Notification entity to NotificationResponse DTO manually to avoid LazyInitializationException
     */
    private NotificationResponse mapToNotificationResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setType(notification.getType());
        response.setMessage(notification.getMessage());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());

        // Map sender if present
        if (notification.getSender() != null) {
            User sender = notification.getSender();
            UserResponse senderResponse = mapToUserResponse(sender);
            response.setSender(senderResponse);
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
        response.setPostsCount(postRepository.countByUser(user));
        return response;
    }
}