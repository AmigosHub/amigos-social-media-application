package com.socialmedia.service;

import com.socialmedia.common.enums.FollowStatus;
import com.socialmedia.common.enums.NotificationType;
import com.socialmedia.dto.response.ConversationResponse;
import com.socialmedia.dto.response.MessageResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.entity.Conversation;
import com.socialmedia.entity.Message;
import com.socialmedia.entity.Notification;
import com.socialmedia.entity.User;
import com.socialmedia.exception.BadRequestException;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.repository.BlockedUserRepository;
import com.socialmedia.repository.ConversationRepository;
import com.socialmedia.repository.FollowRepository;
import com.socialmedia.repository.MessageRepository;
import com.socialmedia.repository.NotificationRepository;
import com.socialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final UserService userService;

    @Transactional
    public MessageResponse sendMessage(Long userId, String content) {
        User sender = userService.getCurrentUser();
        User receiver = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new BadRequestException("Cannot send message to yourself");
        }

        // Check if blocked
        if (blockedUserRepository.existsByBlockerAndBlockedUser(sender, receiver) ||
            blockedUserRepository.existsByBlockerAndBlockedUser(receiver, sender)) {
            throw new BadRequestException("Cannot send message");
        }

        // Find or create conversation
        Conversation conversation = conversationRepository.findBetweenUsers(sender, receiver)
            .orElseGet(() -> {
                Conversation newConv = new Conversation();
                newConv.setUser1(sender);
                newConv.setUser2(receiver);
                return conversationRepository.save(newConv);
            });

        // Check if conversation is archived by the sender
        if (conversation.isArchived()) {
            conversation.setArchived(false);
            conversationRepository.save(conversation);
        }

        // Create message
        Message message = new Message();
        message.setContent(content);
        message.setMessageType("TEXT");
        message.setConversation(conversation);
        message.setSender(sender);

        Message savedMessage = messageRepository.save(message);

        // Update conversation last message time
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        // Create notification for receiver
        Notification notification = new Notification();
        notification.setReceiver(receiver);
        notification.setSender(sender);
        notification.setType(NotificationType.MESSAGE_RECEIVED);
        notification.setMessage(sender.getFullName() + " sent you a message");
        notificationRepository.save(notification);

        log.info("Message sent from {} to {}", sender.getUsername(), receiver.getUsername());
        return mapToMessageResponse(savedMessage);
    }

    @Transactional
    public MessageResponse sendMessageToConversation(Long conversationId, String content, Long replyToMessageId) {
        User currentUser = userService.getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        
        // Verify user is part of conversation
        if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
            !conversation.getUser2().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not part of this conversation");
        }
        
        // Check if archived
        if (conversation.isArchived()) {
            conversation.setArchived(false);
            conversationRepository.save(conversation);
        }
        
        Message message = new Message();
        message.setContent(content);
        message.setMessageType("TEXT");
        message.setConversation(conversation);
        message.setSender(currentUser);
        
        if (replyToMessageId != null) {
            Message replyTo = messageRepository.findById(replyToMessageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message to reply not found"));
            message.setReplyTo(replyTo);
        }
        
        Message savedMessage = messageRepository.save(message);
        
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);
        
        // Send notification to receiver
        User receiver = conversation.getUser1().getId().equals(currentUser.getId()) 
            ? conversation.getUser2() : conversation.getUser1();
        Notification notification = new Notification();
        notification.setReceiver(receiver);
        notification.setSender(currentUser);
        notification.setType(NotificationType.MESSAGE_RECEIVED);
        notification.setMessage(currentUser.getFullName() + " sent you a message");
        notificationRepository.save(notification);
        
        log.info("Message sent in conversation {} by user {}", conversationId, currentUser.getUsername());
        return mapToMessageResponse(savedMessage);
    }

    @Transactional
    public void markMessagesAsRead(Long conversationId) {
        User currentUser = userService.getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        // Verify user is part of conversation
        if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
            !conversation.getUser2().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not part of this conversation");
        }

        messageRepository.markMessagesAsRead(conversation, currentUser);
    }

    @Transactional
    public void deleteMessageForUser(Long messageId) {
        User currentUser = userService.getCurrentUser();
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only delete your own messages");
        }

        message.setDeleted(true);
        messageRepository.save(message);
        log.info("Message {} deleted by user {}", messageId, currentUser.getUsername());
    }

    @Transactional
    public MessageResponse updateMessage(Long messageId, String content) {
        User currentUser = userService.getCurrentUser();
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        
        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only update your own messages");
        }
        
        message.setContent(content);
        message.setUpdatedAt(LocalDateTime.now());
        Message updatedMessage = messageRepository.save(message);
        log.info("Message {} updated by user {}", messageId, currentUser.getUsername());
        return mapToMessageResponse(updatedMessage);
    }

    @Transactional(readOnly = true)
    public MessageResponse getMessage(Long messageId) {
        User currentUser = userService.getCurrentUser();
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        
        // Verify user is part of conversation
        Conversation conversation = message.getConversation();
        if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
            !conversation.getUser2().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have access to this message");
        }
        
        return mapToMessageResponse(message);
    }

    @Transactional
    public MessageResponse replyToMessage(Long messageId, String content) {
        Message originalMessage = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        
        return sendMessageToConversation(
            originalMessage.getConversation().getId(),
            content,
            messageId
        );
    }

    @Transactional
    public void archiveConversation(Long conversationId) {
        User currentUser = userService.getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
            !conversation.getUser2().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not part of this conversation");
        }

        conversation.setArchived(true);
        conversationRepository.save(conversation);
        log.info("Conversation {} archived by user {}", conversationId, currentUser.getUsername());
    }

    @Transactional(readOnly = true)
    public PageResponse<ConversationResponse> getConversations(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Conversation> conversations = conversationRepository.findActiveByUser(currentUser, pageable);

        List<ConversationResponse> conversationResponses = conversations.getContent().stream()
            .map(conv -> mapToConversationResponse(conv, currentUser))
            .collect(Collectors.toList());

        return PageResponse.<ConversationResponse>builder()
            .content(conversationResponses)
            .pageNumber(conversations.getNumber())
            .pageSize(conversations.getSize())
            .totalElements(conversations.getTotalElements())
            .totalPages(conversations.getTotalPages())
            .last(conversations.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<MessageResponse> getMessages(Long conversationId, int page, int size) {
        User currentUser = userService.getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
            !conversation.getUser2().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not part of this conversation");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findMessagesByConversation(conversation, pageable);

        List<MessageResponse> messageResponses = messages.getContent().stream()
            .filter(msg -> !msg.isDeleted() || msg.getSender().getId().equals(currentUser.getId()))
            .map(this::mapToMessageResponse)
            .collect(Collectors.toList());

        return PageResponse.<MessageResponse>builder()
            .content(messageResponses)
            .pageNumber(messages.getNumber())
            .pageSize(messages.getSize())
            .totalElements(messages.getTotalElements())
            .totalPages(messages.getTotalPages())
            .last(messages.isLast())
            .build();
    }

    @Transactional
    public PageResponse<MessageResponse> getMessagesAndMarkAsRead(Long conversationId, int page, int size) {
        User currentUser = userService.getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
            !conversation.getUser2().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not part of this conversation");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findMessagesByConversation(conversation, pageable);

        List<MessageResponse> messageResponses = messages.getContent().stream()
            .filter(msg -> !msg.isDeleted() || msg.getSender().getId().equals(currentUser.getId()))
            .map(this::mapToMessageResponse)
            .collect(Collectors.toList());

        // Mark messages as read (now in the same transaction)
        messageRepository.markMessagesAsRead(conversation, currentUser);

        return PageResponse.<MessageResponse>builder()
            .content(messageResponses)
            .pageNumber(messages.getNumber())
            .pageSize(messages.getSize())
            .totalElements(messages.getTotalElements())
            .totalPages(messages.getTotalPages())
            .last(messages.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<MessageResponse> searchMessages(String query, Long conversationId, int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        
        Page<Message> messages;
        if (conversationId != null) {
            Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
            
            if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
                !conversation.getUser2().getId().equals(currentUser.getId())) {
                throw new BadRequestException("You are not part of this conversation");
            }
            
            messages = messageRepository.searchMessagesInConversation(conversation, query, pageable);
        } else {
            messages = messageRepository.searchMessagesForUser(currentUser, query, pageable);
        }
        
        List<MessageResponse> messageResponses = messages.getContent().stream()
            .map(this::mapToMessageResponse)
            .collect(Collectors.toList());
        
        return PageResponse.<MessageResponse>builder()
            .content(messageResponses)
            .pageNumber(messages.getNumber())
            .pageSize(messages.getSize())
            .totalElements(messages.getTotalElements())
            .totalPages(messages.getTotalPages())
            .last(messages.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        List<Conversation> conversations = conversationRepository.findByUser(currentUser, PageRequest.of(0, 1000)).getContent();
        return messageRepository.countUnreadMessagesInConversations(conversations, currentUser);
    }

    /**
     * Map Conversation entity to ConversationResponse DTO manually
     */
    private ConversationResponse mapToConversationResponse(Conversation conversation, User currentUser) {
        ConversationResponse response = new ConversationResponse();
        response.setId(conversation.getId());
        response.setArchived(conversation.isArchived());
        response.setLastMessageAt(conversation.getLastMessageAt());
        response.setCreatedAt(conversation.getCreatedAt());
        response.setUpdatedAt(conversation.getUpdatedAt());

        // Map user1
        User user1 = conversation.getUser1();
        UserResponse user1Response = mapToUserResponse(user1);
        response.setUser1(user1Response);

        // Map user2
        User user2 = conversation.getUser2();
        UserResponse user2Response = mapToUserResponse(user2);
        response.setUser2(user2Response);

        // Get last message
        if (conversation.getMessages() != null && !conversation.getMessages().isEmpty()) {
            Message lastMessage = conversation.getMessages().get(conversation.getMessages().size() - 1);
            response.setLastMessage(lastMessage.getContent());
        }

        // Get unread count
        long unreadCount = messageRepository.countUnreadMessages(conversation, currentUser);
        response.setUnreadCount((int) unreadCount);

        return response;
    }

    /**
     * Map Message entity to MessageResponse DTO manually to avoid LazyInitializationException
     */
    private MessageResponse mapToMessageResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setContent(message.getContent());
        response.setMessageType(message.getMessageType());
        response.setRead(message.isRead());
        response.setDeleted(message.isDeleted());
        response.setCreatedAt(message.getCreatedAt());
        response.setReadAt(message.getReadAt());
        response.setConversationId(message.getConversation().getId());

        // Map sender manually
        User sender = message.getSender();
        UserResponse senderResponse = mapToUserResponse(sender);
        response.setSender(senderResponse);

        // Map reply to message if exists
        if (message.getReplyTo() != null) {
            Message replyTo = message.getReplyTo();
            MessageResponse replyResponse = new MessageResponse();
            replyResponse.setId(replyTo.getId());
            replyResponse.setContent(replyTo.getContent());
            replyResponse.setMessageType(replyTo.getMessageType());
            replyResponse.setCreatedAt(replyTo.getCreatedAt());
            
            // Map reply sender
            User replySender = replyTo.getSender();
            UserResponse replySenderResponse = mapToUserResponse(replySender);
            replyResponse.setSender(replySenderResponse);
            
            response.setReplyTo(replyResponse);
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
        
        // Calculate counts from database
        response.setFollowersCount(followRepository.countByFollowingAndStatus(user, FollowStatus.ACCEPTED));
        response.setFollowingCount(followRepository.countByFollowerAndStatus(user, FollowStatus.ACCEPTED));
        
        return response;
    }
}