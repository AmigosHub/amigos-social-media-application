package com.socialmedia.websocket;

import lombok.Data;

@Data
public class ReadReceipt {
    private Long userId;
    private Long conversationId;
    private Long messageId;
}