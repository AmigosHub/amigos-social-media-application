package com.socialmedia.controller;

import com.socialmedia.dto.request.LoginRequest;
import com.socialmedia.dto.request.SignupRequest;
import com.socialmedia.dto.response.ApiResponse;
import com.socialmedia.dto.response.AuthResponse;
import com.socialmedia.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody SignupRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        return authService.logout();
    }

    @GetMapping("/validate")
    public ApiResponse<Boolean> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return authService.validateToken(token);
        }
        return ApiResponse.success("Token validation result", false);
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        return authService.refreshToken(refreshToken);
    }
}