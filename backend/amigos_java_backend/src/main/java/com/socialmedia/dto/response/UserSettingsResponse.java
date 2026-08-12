package com.socialmedia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsResponse {
    private Long userId;
    private boolean emailNotifications;
    private boolean messageNotifications;
    private boolean pushNotifications;
    private String accountVisibility;
    private String language;
    private String theme;
}