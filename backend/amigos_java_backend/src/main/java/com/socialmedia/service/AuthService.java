package com.socialmedia.service;

import com.socialmedia.common.enums.Role;
import com.socialmedia.dto.request.LoginRequest;
import com.socialmedia.dto.request.SignupRequest;
import com.socialmedia.dto.response.AuthResponse;
import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.entity.User;
import com.socialmedia.entity.UserSettings;
import com.socialmedia.exception.BadRequestException;
import com.socialmedia.repository.UserRepository;
import com.socialmedia.repository.UserSettingsRepository;
import com.socialmedia.security.CustomUserDetailsImpl;
import com.socialmedia.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public ApiResponse<AuthResponse> register(SignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setBio(request.getBio() != null ? request.getBio() : "");
        user.setRole(Role.USER);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // Create user settings
        UserSettings settings = new UserSettings();
        settings.setUser(savedUser);
        userSettingsRepository.save(settings);

        // Generate JWT token
        String token = jwtUtils.generateJWT(
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getRole().name()
        );

        AuthResponse response = new AuthResponse(
            token,
            savedUser.getId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getFullName(),
            savedUser.getRole().name()
        );

        log.info("User registered successfully: {}", savedUser.getUsername());
        return ApiResponse.success("Registration successful", response);
    }

    @Transactional
    public ApiResponse<AuthResponse> login(LoginRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get user details from authentication
            CustomUserDetailsImpl userDetails = (CustomUserDetailsImpl) authentication.getPrincipal();

            User user = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new BadRequestException("User not found"));

            if (!user.isActive()) {
                throw new BadRequestException("Account is deactivated. Please contact support.");
            }

            // Update last seen
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);

            // Generate JWT token
            String token = jwtUtils.generateJWT(
                user.getId(),
                user.getUsername(),
                user.getRole().name()
            );

            AuthResponse response = new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
            );

            log.info("User logged in successfully: {}", user.getUsername());
            return ApiResponse.success("Login successful", response);

        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            log.warn("Login failed for email: {} - Invalid credentials", request.getEmail());
            throw new BadRequestException("Invalid email or password");
        } catch (Exception e) {
            log.error("Login error for email: {}", request.getEmail(), e);
            throw new BadRequestException("Login failed: " + e.getMessage());
        }
    }

    @Transactional
    public ApiResponse<Void> logout() {
        try {
            // Get current user if authenticated
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();
                if (principal instanceof CustomUserDetailsImpl) {
                    CustomUserDetailsImpl userDetails = (CustomUserDetailsImpl) principal;
                    log.info("User logged out: {}", userDetails.getUsername());
                } else if (principal instanceof Long) {
                    log.info("User logged out with ID: {}", principal);
                } else {
                    log.info("User logged out");
                }
            } else {
                log.info("Anonymous user logged out");
            }

            // Clear security context
            SecurityContextHolder.clearContext();

            // In a stateless JWT setup, logout is primarily handled client-side
            // by removing the token. However, you could implement:
            // 1. Token blacklisting (add token to a blacklist cache)
            // 2. Log the logout action for audit purposes
            
            return ApiResponse.success("Logged out successfully");
            
        } catch (Exception e) {
            log.error("Logout error", e);
            return ApiResponse.error("Logout failed: " + e.getMessage());
        }
    }

    /**
     * Validate current JWT token
     */
    public ApiResponse<Boolean> validateToken(String token) {
        try {
            boolean isValid = jwtUtils.isTokenValid(token);
            if (isValid) {
                String username = jwtUtils.getUsernameFromToken(token);
                log.debug("Token validated for user: {}", username);
            }
            return ApiResponse.success("Token validation result", isValid);
        } catch (Exception e) {
            log.error("Token validation error", e);
            return ApiResponse.success("Token validation result", false);
        }
    }

    /**
     * Refresh token
     */
    @Transactional
    public ApiResponse<AuthResponse> refreshToken(String refreshToken) {
        try {
            if (!jwtUtils.isTokenValid(refreshToken)) {
                throw new BadRequestException("Invalid or expired refresh token");
            }

            String username = jwtUtils.getUsernameFromToken(refreshToken);
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("User not found"));

            if (!user.isActive()) {
                throw new BadRequestException("Account is deactivated");
            }

            // Generate new access token
            String newToken = jwtUtils.generateJWT(
                user.getId(),
                user.getUsername(),
                user.getRole().name()
            );

            AuthResponse response = new AuthResponse(
                newToken,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
            );

            log.info("Token refreshed for user: {}", user.getUsername());
            return ApiResponse.success("Token refreshed successfully", response);

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Token refresh error", e);
            throw new BadRequestException("Failed to refresh token: " + e.getMessage());
        }
    }
}