package com.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowStatusResponse {
    private boolean isFollowing;
    private boolean isFollowedBy;
    private boolean hasPendingRequest;
    private boolean isBlocked;
    private boolean isBlockedBy;
}