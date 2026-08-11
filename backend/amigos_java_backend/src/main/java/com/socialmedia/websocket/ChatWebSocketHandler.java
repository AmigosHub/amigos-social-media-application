package com.socialmedia.websocket;

import com.socialmedia.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * WebSocket handler for real-time chat functionality.
 * Handles sending messages, typing indicators, and read receipts.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    /**
     * Handles sending a new chat message.
     * Saves message to database and delivers it to the recipient's queue.
     * 
     * @param webSocketMessage Contains userId and message content
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload WebSocketMessage webSocketMessage) {
        log.info("Received WebSocket message: {}", webSocketMessage);

        try {
            // Save message to database and get response
            var response = chatService.sendMessage(
                webSocketMessage.getUserId(),
                webSocketMessage.getContent()
            );

            // Send message to specific user's queue for real-time delivery
            messagingTemplate.convertAndSendToUser(
                webSocketMessage.getUserId().toString(),
                "/queue/messages",
                response
            );
        } catch (Exception e) {
            log.error("Error processing WebSocket message: {}", e.getMessage());
        }
    }

    /**
     * Handles typing indicator events.
     * Broadcasts typing status to the conversation participants.
     * 
     * @param typing Contains userId, conversationId, and typing status
     */
    @MessageMapping("/chat.typing")
    public void typing(@Payload TypingIndicator typing) {
        log.info("User {} is typing in conversation {}", typing.getUserId(), typing.getConversationId());

        // Broadcast typing status to the recipient
        messagingTemplate.convertAndSendToUser(
            typing.getUserId().toString(),
            "/queue/typing",
            typing
        );
    }

    /**
     * Handles read receipt events.
     * Marks messages as read and notifies the sender.
     * 
     * @param receipt Contains userId, conversationId, and messageId
     */
    @MessageMapping("/chat.read")
    public void markAsRead(@Payload ReadReceipt receipt) {
        log.info("User {} read messages in conversation {}", receipt.getUserId(), receipt.getConversationId());

        try {
            // Mark all unread messages in the conversation as read
            chatService.markMessagesAsRead(receipt.getConversationId());

            // Notify the sender that messages were read
            messagingTemplate.convertAndSendToUser(
                receipt.getUserId().toString(),
                "/queue/read",
                receipt
            );
        } catch (Exception e) {
            log.error("Error marking messages as read: {}", e.getMessage());
        }
    }
}