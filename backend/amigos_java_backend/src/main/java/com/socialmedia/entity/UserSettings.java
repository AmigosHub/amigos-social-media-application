package com.socialmedia.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
public class UserSettings {

    @Id
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "email_notifications")
    private boolean emailNotifications = true;

    @Column(name = "message_notifications")
    private boolean messageNotifications = true;

    @Column(name = "push_notifications")
    private boolean pushNotifications = true;

    @Column(name = "account_visibility")
    private String accountVisibility = "PUBLIC"; // PUBLIC, PRIVATE

    @Column(name = "language")
    private String language = "en";

    @Column(name = "theme")
    private String theme = "LIGHT"; // LIGHT, DARK, SYSTEM
}