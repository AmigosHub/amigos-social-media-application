package com.socialmedia.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Custom authentication entry point that handles unauthorized access attempts.
 * Returns a JSON response instead of the default HTML redirect.
 */
@Component
public class AuthEntryPoint implements AuthenticationEntryPoint {

    /**
     * Called when an unauthenticated user attempts to access a secured resource.
     * Sends a 401 Unauthorized response with a JSON error message.
     *
     * @param request       The HTTP request that triggered the authentication failure
     * @param response      The HTTP response to send back to the client
     * @param authException The exception that caused the authentication failure
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        // Set HTTP status to 401 Unauthorized
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        // Set response content type to JSON
        response.setContentType("application/json");
        // Write JSON error response with the exception message
        response.getWriter().write("{\"success\":false,\"message\":\"Unauthorized: " + authException.getMessage() + "\"}");
    }
}