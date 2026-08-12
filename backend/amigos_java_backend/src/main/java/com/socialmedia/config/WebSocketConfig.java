package com.socialmedia.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Configuration for Real-time Chat
 * Enables STOMP protocol over WebSocket for bidirectional messaging
 */
@Configuration
@EnableWebSocketMessageBroker // Enables WebSocket message handling, backed by a message broker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Registers STOMP endpoints for WebSocket connections
     * Clients connect to this endpoint to establish WebSocket connection
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // WebSocket endpoint URL
            .setAllowedOrigins("http://localhost:3000", "http://localhost:5173") // Allowed frontend origins (React/Vite)
            .withSockJS(); // Enables SockJS fallback for browsers that don't support WebSocket
    }

    /**
     * Configures the message broker for routing messages
     * Defines destination prefixes for sending and receiving messages
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Enables simple in-memory message broker with destination prefixes
        // /topic - for broadcast messages (public chat rooms)
        // /queue - for point-to-point messages (private chat)
        registry.enableSimpleBroker("/topic", "/queue");
        
        // Prefix for messages sent from client to server
        // Clients send to: /app/chat.send
        registry.setApplicationDestinationPrefixes("/app");
        
        // Prefix for user-specific messages
        // Enables sending messages to specific users: /user/{userId}/queue/messages
        registry.setUserDestinationPrefix("/user");
    }
}