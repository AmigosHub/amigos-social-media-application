package com.socialmedia.repository;

import com.socialmedia.entity.Conversation;
import com.socialmedia.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.user1 = :user1 AND c.user2 = :user2) OR " +
           "(c.user1 = :user2 AND c.user2 = :user1)")
    Optional<Conversation> findBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);

    @Query("SELECT c FROM Conversation c WHERE c.user1 = :user OR c.user2 = :user ORDER BY c.lastMessageAt DESC")
    Page<Conversation> findByUser(@Param("user") User user, Pageable pageable);

    @Query("SELECT c FROM Conversation c WHERE (c.user1 = :user OR c.user2 = :user) AND c.isArchived = false ORDER BY c.lastMessageAt DESC")
    Page<Conversation> findActiveByUser(@Param("user") User user, Pageable pageable);

    boolean existsByUser1AndUser2(User user1, User user2);

    boolean existsByUser1AndUser2OrUser2AndUser1(User user1, User user2, User user2b, User user1b);
}