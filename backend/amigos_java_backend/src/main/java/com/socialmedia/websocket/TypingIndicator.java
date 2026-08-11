package com.socialmedia.websocket;

import lombok.Data;

@Data
public class TypingIndicator {
    private Long userId;
    private Long conversationId;
    private boolean isTyping;
}