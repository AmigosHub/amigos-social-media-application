package com.socialmedia.repository;

import com.socialmedia.entity.BlockedUser;
import com.socialmedia.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {

    Optional<BlockedUser> findByBlockerAndBlockedUser(User blocker, User blockedUser);

    boolean existsByBlockerAndBlockedUser(User blocker, User blockedUser);

    void deleteByBlockerAndBlockedUser(User blocker, User blockedUser);

    Page<BlockedUser> findByBlockerOrderByCreatedAtDesc(User blocker, Pageable pageable);

    @Query("SELECT b.blockedUser FROM BlockedUser b WHERE b.blocker = :user")
    Page<User> findBlockedUsersByBlocker(@Param("user") User user, Pageable pageable);

    @Query("SELECT b.blocker FROM BlockedUser b WHERE b.blockedUser = :user")
    Page<User> findBlockersByBlockedUser(@Param("user") User user, Pageable pageable);

    /**
     * Get all user IDs that a specific user has blocked
     */
    @Query("SELECT b.blockedUser.id FROM BlockedUser b WHERE b.blocker.id = :userId")
    List<Long> findBlockedUserIdsByBlockerId(@Param("userId") Long userId);

    /**
     * Get all user IDs that have blocked a specific user
     */
    @Query("SELECT b.blocker.id FROM BlockedUser b WHERE b.blockedUser.id = :userId")
    List<Long> findBlockerIdsByBlockedUserId(@Param("userId") Long userId);

    /**
     * Check if there's a block relationship between two users (either direction)
     */
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM BlockedUser b " +
           "WHERE (b.blocker.id = :userId1 AND b.blockedUser.id = :userId2) " +
           "OR (b.blocker.id = :userId2 AND b.blockedUser.id = :userId1)")
    boolean existsBlockedRelationship(@Param("userId1") Long userId1, 
                                      @Param("userId2") Long userId2);

    /**
     * Check if user1 has blocked user2
     */
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM BlockedUser b " +
           "WHERE b.blocker.id = :blockerId AND b.blockedUser.id = :blockedUserId")
    boolean existsBlockerAndBlockedUser(@Param("blockerId") Long blockerId, 
                                        @Param("blockedUserId") Long blockedUserId);
}