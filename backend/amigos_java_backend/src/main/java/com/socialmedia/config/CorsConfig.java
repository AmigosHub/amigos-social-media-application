package com.socialmedia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Allow CORS for all endpoints
                registry.addMapping("/**")
                    // Allow requests from these frontend origins
                    .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                    // Allow these HTTP methods
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                    // Allow all headers
                    .allowedHeaders("*")
                    // Allow credentials (cookies, authorization headers)
                    .allowCredentials(true)
                    // Cache preflight response for 1 hour (3600 seconds)
                    .maxAge(3600);
            }
        };
    }
}