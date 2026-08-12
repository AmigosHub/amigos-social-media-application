package com.socialmedia.dto.request;

import lombok.Data;

@Data
public class SettingsRequest {

    private Boolean emailNotifications;

    private Boolean messageNotifications;

    private Boolean pushNotifications;

    private String accountVisibility;

    private String language;

    private String theme;
}