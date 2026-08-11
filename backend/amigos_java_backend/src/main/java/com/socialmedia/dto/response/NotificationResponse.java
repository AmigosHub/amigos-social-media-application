package com.socialmedia.dto.response;

import com.socialmedia.common.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private NotificationType type;
    private String message;
    private boolean isRead;
    private UserResponse sender;
    private PostResponse post;
    private CommentResponse comment;
    private LocalDateTime createdAt;
}