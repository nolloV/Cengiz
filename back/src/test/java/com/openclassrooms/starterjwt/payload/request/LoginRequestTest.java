package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class LoginRequestTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidLoginRequest() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
        assertTrue(violations.isEmpty());
    }

    @Test
    public void testInvalidLoginRequest_EmailBlank() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("");
        loginRequest.setPassword("password");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidLoginRequest_PasswordBlank() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidLoginRequest_EmailNull() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(null);
        loginRequest.setPassword("password");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidLoginRequest_PasswordNull() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword(null);

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testGettersAndSetters() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");

        assertEquals("test@example.com", loginRequest.getEmail());
        assertEquals("password", loginRequest.getPassword());
    }
}
