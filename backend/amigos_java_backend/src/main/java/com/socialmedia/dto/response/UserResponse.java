package com.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String profilePic;
    private boolean isPrivate;
    private boolean isActive;
    private LocalDateTime lastSeen;
    private Long followersCount;
    private Long followingCount;
    private Long postsCount;
    private boolean isFollowedByCurrentUser;
    private boolean isFollowingCurrentUser;
}