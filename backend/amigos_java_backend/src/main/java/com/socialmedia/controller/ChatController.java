package com.socialmedia.controller;

import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.ConversationResponse;
import com.socialmedia.dto.response.MessageResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/users/{userId}")
    public ApiResponse<MessageResponse> sendMessage(
            @PathVariable Long userId,
            @RequestParam String content) {
        return ApiResponse.success("Message sent", chatService.sendMessage(userId, content));
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ApiResponse<MessageResponse> sendMessageToConversation(
            @PathVariable Long conversationId,
            @RequestParam String content,
            @RequestParam(required = false) Long replyToMessageId) {
        return ApiResponse.success("Message sent", 
            chatService.sendMessageToConversation(conversationId, content, replyToMessageId));
    }

    @PatchMapping("/conversations/{conversationId}/read")
    public ApiResponse<Void> markMessagesAsRead(@PathVariable Long conversationId) {
        chatService.markMessagesAsRead(conversationId);
        return ApiResponse.success("Messages marked as read");
    }

    @DeleteMapping("/messages/{messageId}")
    public ApiResponse<Void> deleteMessage(@PathVariable Long messageId) {
        chatService.deleteMessageForUser(messageId);
        return ApiResponse.success("Message deleted");
    }

    @PutMapping("/messages/{messageId}")
    public ApiResponse<MessageResponse> updateMessage(
            @PathVariable Long messageId,
            @RequestParam String content) {
        return ApiResponse.success("Message updated", chatService.updateMessage(messageId, content));
    }

    @GetMapping("/messages/{messageId}")
    public ApiResponse<MessageResponse> getMessage(@PathVariable Long messageId) {
        return ApiResponse.success("Message retrieved", chatService.getMessage(messageId));
    }

    @PostMapping("/messages/{messageId}/reply")
    public ApiResponse<MessageResponse> replyToMessage(
            @PathVariable Long messageId,
            @RequestParam String content) {
        return ApiResponse.success("Reply sent", chatService.replyToMessage(messageId, content));
    }

    @GetMapping("/messages/search")
    public ApiResponse<PageResponse<MessageResponse>> searchMessages(
            @RequestParam String q,
            @RequestParam(required = false) Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Messages found", chatService.searchMessages(q, conversationId, page, size));
    }

    @PatchMapping("/conversations/{conversationId}/archive")
    public ApiResponse<Void> archiveConversation(@PathVariable Long conversationId) {
        chatService.archiveConversation(conversationId);
        return ApiResponse.success("Conversation archived");
    }

    @GetMapping("/conversations")
    public ApiResponse<PageResponse<ConversationResponse>> getConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("Conversations retrieved", chatService.getConversations(page, size));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ApiResponse<PageResponse<MessageResponse>> getMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.success("Messages retrieved", chatService.getMessagesAndMarkAsRead(conversationId, page, size));
    }

    @GetMapping("/unread/count")
    public ApiResponse<Long> getUnreadCount() {
        return ApiResponse.success("Unread count retrieved", chatService.getUnreadCount());
    }
}