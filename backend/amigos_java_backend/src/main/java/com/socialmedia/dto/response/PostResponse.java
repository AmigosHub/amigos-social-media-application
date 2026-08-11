package com.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Long id;
    private String content;
    private String mediaUrl;
    private String mediaType;
    private UserResponse user;
    private Long likesCount;
    private Long commentsCount;
    private boolean isLikedByCurrentUser;
    private boolean isSavedByCurrentUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentResponse> recentComments;
}