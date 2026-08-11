package com.socialmedia.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * Listens to WebSocket connection events (connect/disconnect) for logging and monitoring.
 * Tracks real-time WebSocket sessions for debugging and analytics purposes.
 */
@Component
@Slf4j
public class WebSocketEventListener {

    /**
     * Handles new WebSocket connection events.
     * Logs the session ID when a client establishes a WebSocket connection.
     */
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        // Wraps the STOMP message to access header information
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        log.info("New WebSocket connection: {}", headerAccessor.getSessionId());
    }

    /**
     * Handles WebSocket disconnection events.
     * Logs the session ID when a client disconnects from the WebSocket.
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // Wraps the STOMP message to access header information
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        log.info("WebSocket disconnected: {}", headerAccessor.getSessionId());
    }
}