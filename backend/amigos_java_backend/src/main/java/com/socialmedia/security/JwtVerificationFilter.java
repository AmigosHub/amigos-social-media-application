package com.socialmedia.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT Verification Filter - intercepts each request to validate JWT tokens.
 * Extracts JWT from Authorization header, validates it, and sets authentication in SecurityContext.
 * Executes once per request (OncePerRequestFilter).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtVerificationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    /**
     * Core filter method that validates JWT tokens for incoming requests.
     * If token is valid, sets authentication in Spring Security context.
     * If invalid, clears context and returns 401 Unauthorized.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // 1. Extract Authorization header from request
            String authHeader = request.getHeader("Authorization");

            // 2. Check if header exists and starts with "Bearer "
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                // 3. Extract JWT token (remove "Bearer " prefix)
                String jwt = authHeader.substring(7);
                log.debug("Validating JWT: {}", jwt.substring(0, Math.min(jwt.length(), 20)) + "...");

                // 4. Verify JWT and extract claims (user_id and user_role)
                Claims payload = jwtUtils.verifyJwtAndExtractClaims(jwt);

                // 5. Extract user details from claims
                Long userId = payload.get("user_id", Long.class);
                String roleName = payload.get("user_role", String.class);

                // 6. Create authentication token with user ID and role (as GrantedAuthority)
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                    userId, 
                    null, 
                    List.of(new SimpleGrantedAuthority("ROLE_" + roleName))
                );

                // 7. Set authentication in Spring Security context
                SecurityContextHolder.getContext().setAuthentication(token);
                log.debug("Authentication set for user ID: {}", userId);
            }

            // 8. Continue with the filter chain
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // 9. Handle validation failure - clear context and return 401 Unauthorized
            log.error("JWT validation failed: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"success\":false,\"message\":\"Invalid JWT - Authentication Failed\"}");
        }
    }
}