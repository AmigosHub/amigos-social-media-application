package com.socialmedia.dto.response;

import com.socialmedia.common.enums.ReportReason;
import com.socialmedia.common.enums.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

    private Long id;
    private ReportReason reason;
    private String description;
    private ReportStatus status;
    private UserResponse reporter;
    private UserResponse reportedUser;
    private PostResponse post;
    private CommentResponse comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}