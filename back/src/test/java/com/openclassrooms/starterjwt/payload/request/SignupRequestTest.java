package com.openclassrooms.starterjwt.payload.request;

import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class SignupRequestTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidSignupRequest() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertTrue(violations.isEmpty());
    }

    @Test
    public void testInvalidSignupRequest_EmailBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidSignupRequest_EmailInvalid() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("invalid-email");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertEquals("doit être une adresse électronique syntaxiquement correcte", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidSignupRequest_FirstNameBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName(null);
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("ne doit pas être vide")));
    }

    @Test
    public void testInvalidSignupRequest_LastNameBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName(null);
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("ne doit pas être vide")));
    }

    @Test
    public void testInvalidSignupRequest_PasswordBlank() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword(null);

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidSignupRequest_PasswordTooShort() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("short");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertEquals("la taille doit être comprise entre 6 et 40", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidSignupRequest_PasswordTooLong() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("ThisPasswordIsWayTooLongToBeValidAndShouldFailTheValidation");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertEquals("la taille doit être comprise entre 6 et 40", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidSignupRequest_EmailNull() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(null);
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidSignupRequest_FirstNameTooShort() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("Jo");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertEquals("la taille doit être comprise entre 3 et 20", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidSignupRequest_LastNameTooShort() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Do");
        signupRequest.setPassword("password123");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);
        assertEquals(1, violations.size());
        assertEquals("la taille doit être comprise entre 3 et 20", violations.iterator().next().getMessage());
    }

    @Test
    public void testGettersAndSetters() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        assertEquals("test@example.com", signupRequest.getEmail());
        assertEquals("John", signupRequest.getFirstName());
        assertEquals("Doe", signupRequest.getLastName());
        assertEquals("password123", signupRequest.getPassword());
    }

    @Test
    public void testEquals() {
        SignupRequest signupRequest1 = new SignupRequest();
        signupRequest1.setEmail("test@example.com");
        signupRequest1.setFirstName("John");
        signupRequest1.setLastName("Doe");
        signupRequest1.setPassword("password123");

        SignupRequest signupRequest2 = new SignupRequest();
        signupRequest2.setEmail("test@example.com");
        signupRequest2.setFirstName("John");
        signupRequest2.setLastName("Doe");
        signupRequest2.setPassword("password123");

        assertEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void testNotEquals() {
        SignupRequest signupRequest1 = new SignupRequest();
        signupRequest1.setEmail("test@example.com");
        signupRequest1.setFirstName("John");
        signupRequest1.setLastName("Doe");
        signupRequest1.setPassword("password123");

        SignupRequest signupRequest2 = new SignupRequest();
        signupRequest2.setEmail("different@example.com");
        signupRequest2.setFirstName("Jane");
        signupRequest2.setLastName("Doe");
        signupRequest2.setPassword("password123");

        assertNotEquals(signupRequest1, signupRequest2);
    }

    @Test
    public void testEquals_Null() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        assertNotEquals(signupRequest, null);
    }

    @Test
    public void testEquals_DifferentClass() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        assertNotEquals(signupRequest, new Object());
    }

    @Test
    public void testEquals_SameObject() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        assertEquals(signupRequest, signupRequest);
    }

    @Test
    public void testHashCode() {
        SignupRequest signupRequest1 = new SignupRequest();
        signupRequest1.setEmail("test@example.com");
        signupRequest1.setFirstName("John");
        signupRequest1.setLastName("Doe");
        signupRequest1.setPassword("password123");

        SignupRequest signupRequest2 = new SignupRequest();
        signupRequest2.setEmail("test@example.com");
        signupRequest2.setFirstName("John");
        signupRequest2.setLastName("Doe");
        signupRequest2.setPassword("password123");

        assertEquals(signupRequest1.hashCode(), signupRequest2.hashCode());
    }

    @Test
    public void testHashCode_Different() {
        SignupRequest signupRequest1 = new SignupRequest();
        signupRequest1.setEmail("test@example.com");
        signupRequest1.setFirstName("John");
        signupRequest1.setLastName("Doe");
        signupRequest1.setPassword("password123");

        SignupRequest signupRequest2 = new SignupRequest();
        signupRequest2.setEmail("different@example.com");
        signupRequest2.setFirstName("Jane");
        signupRequest2.setLastName("Doe");
        signupRequest2.setPassword("password123");

        assertNotEquals(signupRequest1.hashCode(), signupRequest2.hashCode());
    }

    @Test
    public void testToString() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        String expected = "SignupRequest(email=test@example.com, firstName=John, lastName=Doe, password=password123)";
        assertEquals(expected, signupRequest.toString());
    }

    @Test
    public void testCanEqual() {
        SignupRequest signupRequest1 = new SignupRequest();
        signupRequest1.setEmail("test@example.com");
        signupRequest1.setFirstName("John");
        signupRequest1.setLastName("Doe");
        signupRequest1.setPassword("password123");

        SignupRequest signupRequest2 = new SignupRequest();
        assertTrue(signupRequest1.canEqual(signupRequest2));

        // Test with null
        assertFalse(signupRequest1.canEqual(null));

        // Test with different class
        assertFalse(signupRequest1.canEqual(new Object()));
    }
}
