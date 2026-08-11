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
public class ConversationResponse {

    private Long id;
    private UserResponse user1;
    private UserResponse user2;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private boolean isArchived;
    private int unreadCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}