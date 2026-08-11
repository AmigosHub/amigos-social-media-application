package com.socialmedia.repository;

import com.socialmedia.entity.Conversation;
import com.socialmedia.entity.Message;
import com.socialmedia.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByConversationOrderByCreatedAtDesc(Conversation conversation, Pageable pageable);

    @Query("SELECT m FROM Message m WHERE m.conversation = :conversation ORDER BY m.createdAt DESC")
    Page<Message> findMessagesByConversation(@Param("conversation") Conversation conversation, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true, m.readAt = CURRENT_TIMESTAMP " +
           "WHERE m.conversation = :conversation AND m.sender != :user AND m.isRead = false")
    void markMessagesAsRead(@Param("conversation") Conversation conversation, @Param("user") User user);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation = :conversation AND m.sender != :user AND m.isRead = false")
    long countUnreadMessages(@Param("conversation") Conversation conversation, @Param("user") User user);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation IN :conversations AND m.sender != :user AND m.isRead = false")
    long countUnreadMessagesInConversations(@Param("conversations") java.util.List<Conversation> conversations, @Param("user") User user);

    @Query("SELECT m FROM Message m WHERE m.conversation = :conversation AND m.sender = :user AND m.isDeleted = false ORDER BY m.createdAt DESC")
    Page<Message> findUserMessagesInConversation(@Param("user") User user, @Param("conversation") Conversation conversation, Pageable pageable);

    /**
     * Search messages within a specific conversation
     */
    @Query("SELECT m FROM Message m WHERE m.conversation = :conversation " +
           "AND LOWER(m.content) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "AND m.isDeleted = false ORDER BY m.createdAt DESC")
    Page<Message> searchMessagesInConversation(
            @Param("conversation") Conversation conversation,
            @Param("query") String query,
            Pageable pageable
    );

    /**
     * Search messages across all conversations for a user
     */
    @Query("SELECT m FROM Message m WHERE (m.conversation.user1 = :user OR m.conversation.user2 = :user) " +
           "AND LOWER(m.content) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "AND m.isDeleted = false ORDER BY m.createdAt DESC")
    Page<Message> searchMessagesForUser(
            @Param("user") User user,
            @Param("query") String query,
            Pageable pageable
    );
}