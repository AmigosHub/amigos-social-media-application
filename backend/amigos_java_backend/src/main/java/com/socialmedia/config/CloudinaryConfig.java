package com.socialmedia.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    // Cloudinary cloud name from application.properties
    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    // Cloudinary API key from application.properties
    @Value("${cloudinary.api-key}")
    private String apiKey;

    // Cloudinary API secret from application.properties
    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    // Bean to create and configure Cloudinary instance for file uploads
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret,
            "secure", true // Enable secure HTTPS URLs
        ));
    }
}