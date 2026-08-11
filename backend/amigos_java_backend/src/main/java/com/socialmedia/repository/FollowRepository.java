package com.socialmedia.repository;

import com.socialmedia.entity.Follow;
import com.socialmedia.entity.User;
import com.socialmedia.common.enums.FollowStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    boolean existsByFollowerAndFollowingAndStatus(User follower, User following, FollowStatus status);

    @Query("SELECT f FROM Follow f WHERE f.following = :user AND f.status = 'ACCEPTED'")
    Page<Follow> findFollowers(@Param("user") User user, Pageable pageable);

    @Query("SELECT f FROM Follow f WHERE f.follower = :user AND f.status = 'ACCEPTED'")
    Page<Follow> findFollowing(@Param("user") User user, Pageable pageable);

    @Query("SELECT f FROM Follow f WHERE f.following = :user AND f.status = 'PENDING'")
    Page<Follow> findPendingFollowRequests(@Param("user") User user, Pageable pageable);

    long countByFollowingAndStatus(User user, FollowStatus status);

    long countByFollowerAndStatus(User user, FollowStatus status);

    @Modifying
    void deleteByFollowerAndFollowing(User follower, User following);

    @Query("SELECT f.following FROM Follow f WHERE f.follower = :user AND f.status = 'ACCEPTED'")
    List<User> findFollowingUsers(@Param("user") User user);

    @Query("SELECT f.follower FROM Follow f WHERE f.following = :user AND f.status = 'ACCEPTED'")
    List<User> findFollowerUsers(@Param("user") User user);
}