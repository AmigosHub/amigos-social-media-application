package com.socialmedia.repository;

import com.socialmedia.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> searchUsers(@Param("query") String query, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.isActive = true")
    Page<User> findAllActive(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.id NOT IN :excludeIds AND u.isActive = true")
    Page<User> findUsersNotInList(@Param("excludeIds") List<Long> excludeIds, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.id NOT IN :excludeIds AND u.isActive = true " +
           "AND u.id NOT IN (SELECT b.blockedUser.id FROM BlockedUser b WHERE b.blocker.id = :currentUserId) " +
           "AND u.id NOT IN (SELECT b.blocker.id FROM BlockedUser b WHERE b.blockedUser.id = :currentUserId)")
    Page<User> findUsersNotInListAndNotBlocked(
            @Param("excludeIds") List<Long> excludeIds,
            @Param("currentUserId") Long currentUserId,
            Pageable pageable);
}