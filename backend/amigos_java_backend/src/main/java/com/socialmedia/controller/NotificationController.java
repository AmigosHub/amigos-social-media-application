package com.socialmedia.controller;

import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.NotificationResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ApiResponse<PageResponse<NotificationResponse>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Notifications retrieved", notificationService.getNotifications(page, size));
    }

    @GetMapping("/unread")
    public ApiResponse<PageResponse<NotificationResponse>> getUnreadNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Unread notifications retrieved", notificationService.getUnreadNotifications(page, size));
    }

    @GetMapping("/{notificationId}")
    public ApiResponse<NotificationResponse> getNotification(@PathVariable Long notificationId) {
        return ApiResponse.success("Notification retrieved", notificationService.getNotification(notificationId));
    }

    @PatchMapping("/{notificationId}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ApiResponse.success("Notification marked as read");
    }

    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ApiResponse.success("All notifications marked as read");
    }

    @DeleteMapping("/{notificationId}")
    public ApiResponse<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ApiResponse.success("Notification deleted");
    }

    @GetMapping("/unread/count")
    public ApiResponse<Long> getUnreadCount() {
        return ApiResponse.success("Unread count retrieved", notificationService.getUnreadCount());
    }
}