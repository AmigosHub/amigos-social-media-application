package com.socialmedia.common.util;

import com.socialmedia.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility for retrieving current user info from SecurityContext.
 */
@Component
public class SecurityUtils {

    /**
     * Get current authenticated user ID.
     * @return user ID
     * @throws UnauthorizedException if not authenticated
     */
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }

        throw new UnauthorizedException("Invalid authentication");
    }

    /**
     * Get current user role.
     * @return role name or null if not authenticated
     */
    public String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        return authentication.getAuthorities().stream()
            .map(auth -> auth.getAuthority().replace("ROLE_", ""))
            .findFirst()
            .orElse(null);
    }

    /**
     * Check if user is authenticated.
     * @return true if authenticated
     */
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }
}