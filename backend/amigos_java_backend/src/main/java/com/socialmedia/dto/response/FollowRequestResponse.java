// src/main/java/com/socialmedia/dto/response/FollowRequestResponse.java
package com.socialmedia.dto.response;

import com.socialmedia.common.enums.FollowStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowRequestResponse {
    private Long followRequestId;  // This is the follow ID from the follows table
    private UserResponse user;      // The user who sent the request
    private FollowStatus status;
    private LocalDateTime createdAt;
}