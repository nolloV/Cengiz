package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;
import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetailsImpl userDetails;

    @Value("${oc.app.jwtSecret}")
    private String jwtSecret = "testSecret";

    @Value("${oc.app.jwtExpirationMs}")
    private int jwtExpirationMs = 3600000; // 1 hour

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        jwtUtils = new JwtUtils();

        // Use reflection to set private fields
        setField(jwtUtils, "jwtSecret", jwtSecret);
        setField(jwtUtils, "jwtExpirationMs", jwtExpirationMs);
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    public void testGenerateJwtToken() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("testuser");

        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertNotNull(token);
        String username = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
        assertEquals("testuser", username);
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        // Arrange
        String token = Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // Act
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // Assert
        assertEquals("testuser", username);
    }

    @Test
    public void testValidateJwtToken_ValidToken() {
        // Arrange
        String token = Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    public void testValidateJwtToken_InvalidToken() {
        // Arrange
        String token = "invalidToken";

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertFalse(isValid);
    }

    @Test
    public void testValidateJwtToken_ExpiredToken() {
        // Arrange
        String token = Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new Date(System.currentTimeMillis() - jwtExpirationMs - 1000))
                .setExpiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // Act
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Assert
        assertFalse(isValid);
    }
}
