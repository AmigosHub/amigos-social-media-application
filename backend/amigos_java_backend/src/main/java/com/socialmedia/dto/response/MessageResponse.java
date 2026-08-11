package com.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private Long id;
    private String content;
    private String messageType;
    private boolean isRead;
    private boolean isDeleted;
    private UserResponse sender;
    private Long conversationId;
    private MessageResponse replyTo;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}