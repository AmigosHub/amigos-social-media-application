package com.socialmedia.websocket;

import lombok.Data;

@Data
public class WebSocketMessage {
    private Long userId;
    private String content;
    private Long replyToMessageId;
}