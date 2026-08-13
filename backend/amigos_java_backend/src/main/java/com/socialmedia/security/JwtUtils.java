package com.socialmedia.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

/**
 * Utility class for JWT (JSON Web Token) operations.
 * Handles token generation, validation, and claim extraction.
 * Uses HS256 algorithm for signing tokens.
 */
@Component
@Slf4j
public class JwtUtils {

    @Value("${jwt.secret.key}")
    private String secret;          // Base64 encoded secret key from application properties

    @Value("${jwt.exp.time}")
    private long expTime;           // Token expiration time in milliseconds

    private SecretKey key;          // Symmetric key for signing and verifying tokens

    /**
     * Initializes the JWT signing key.
     * Decodes the Base64 secret key and creates a SecretKey instance.
     * Falls back to UTF-8 bytes if Base64 decoding fails.
     */
    @PostConstruct
    public void init() {
        log.info("Initializing JWT with symmetric key");
        
        try {
            // Decode the Base64 encoded secret key
            byte[] keyBytes = Base64.getDecoder().decode(secret.trim());
            
            // Ensure key meets minimum length requirement for HS256 (32 bytes)
            if (keyBytes.length < 32) {
                log.warn("Key is less than 32 bytes! Padding to 32 bytes.");
                byte[] paddedKey = new byte[32];
                System.arraycopy(keyBytes, 0, paddedKey, 0, Math.min(keyBytes.length, 32));
                keyBytes = paddedKey;
            }
            
            this.key = Keys.hmacShaKeyFor(keyBytes);
            log.info("✅ JWT key initialized. Key length: {} bytes", keyBytes.length);
            
        } catch (IllegalArgumentException e) {
            log.error("❌ Failed to decode Base64 key: {}", e.getMessage());
            log.warn("⚠️ Falling back to using the key as UTF-8 bytes.");
            
            // Fallback: Use the string as UTF-8 bytes if Base64 decoding fails
            byte[] keyBytes = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            
            // Ensure key meets minimum length requirement
            if (keyBytes.length < 32) {
                log.warn("Key is less than 32 bytes! Padding to 32 bytes.");
                byte[] paddedKey = new byte[32];
                System.arraycopy(keyBytes, 0, paddedKey, 0, Math.min(keyBytes.length, 32));
                keyBytes = paddedKey;
            }
            
            this.key = Keys.hmacShaKeyFor(keyBytes);
            log.info("⚠️ JWT key initialized using UTF-8. Key length: {} bytes", keyBytes.length);
        }
    }

    /**
     * Generates a JWT token for the authenticated user.
     * 
     * @param userId   The user's unique identifier
     * @param username The user's username
     * @param role     The user's role (USER, ADMIN)
     * @return A signed JWT token string
     */
    public String generateJWT(Long userId, String username, String role) {
        Date now = new Date();
        Date expDate = new Date(now.getTime() + expTime);

        return Jwts.builder()
            .subject(username)                                                    // Username as subject
            .issuedAt(now)                                                       // Issue timestamp
            .expiration(expDate)                                                 // Expiration timestamp
            .claims(Map.of("user_id", userId, "user_role", role))               // Custom claims (user ID and role)
            .signWith(key)                                                       // Sign with the secret key
            .compact();                                                          // Build and compact to string
    }

    /**
     * Verifies a JWT token and extracts all claims.
     * 
     * @param jwt The JWT token to verify
     * @return The extracted Claims object
     * @throws Exception If token is invalid or expired
     */
    public Claims verifyJwtAndExtractClaims(String jwt) {
        return Jwts.parser()
            .verifyWith(key)                                                     // Verify signature with secret key
            .build()
            .parseSignedClaims(jwt)                                              // Parse and validate the token
            .getPayload();                                                       // Extract the claims body
    }

    /**
     * Extracts the user ID from a JWT token.
     * 
     * @param token The JWT token
     * @return The user ID from the token
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = verifyJwtAndExtractClaims(token);
        return claims.get("user_id", Long.class);
    }

    /**
     * Extracts the username from a JWT token.
     * 
     * @param token The JWT token
     * @return The username from the token
     */
    public String getUsernameFromToken(String token) {
        Claims claims = verifyJwtAndExtractClaims(token);
        return claims.getSubject();
    }

    /**
     * Extracts the user role from a JWT token.
     * 
     * @param token The JWT token
     * @return The user role (USER, ADMIN) from the token
     */
    public String getRoleFromToken(String token) {
        Claims claims = verifyJwtAndExtractClaims(token);
        return claims.get("user_role", String.class);
    }

    /**
     * Checks if a JWT token is valid (properly signed and not expired).
     * 
     * @param token The JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean isTokenValid(String token) {
        try {
            verifyJwtAndExtractClaims(token);
            return true;
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
}