package com.socialmedia.repository;

import com.socialmedia.entity.Notification;
import com.socialmedia.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByReceiverOrderByCreatedAtDesc(User receiver, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.receiver = :user AND n.isRead = false ORDER BY n.createdAt DESC")
    Page<Notification> findUnreadByReceiver(@Param("user") User user, Pageable pageable);

    long countByReceiverAndIsReadFalse(User receiver);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.receiver = :user AND n.isRead = false")
    void markAllAsRead(@Param("user") User user);
}