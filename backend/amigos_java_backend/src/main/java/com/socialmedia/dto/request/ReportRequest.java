package com.socialmedia.dto.request;

import com.socialmedia.common.enums.ReportReason;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportRequest {

    private Long userId;

    private Long postId;

    private Long commentId;

    @NotNull(message = "Reason is required")
    private ReportReason reason;

    private String description;
}