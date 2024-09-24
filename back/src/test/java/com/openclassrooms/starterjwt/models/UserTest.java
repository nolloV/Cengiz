package com.openclassrooms.starterjwt.models;

import java.time.LocalDateTime;
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

public class UserTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setPassword("password123");
        user.setAdmin(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertTrue(violations.isEmpty());
    }

    @Test
    public void testInvalidUserEmail() {
        User user = new User();
        user.setEmail("invalid-email");
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setPassword("password123");
        user.setAdmin(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Set<ConstraintViolation<User>> violations = validator.validate(user);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("doit être une adresse électronique syntaxiquement correcte", violations.iterator().next().getMessage());
    }

    @Test
    public void testEqualsAndHashCode() {
        User user1 = new User();
        user1.setId(1L);
        user1.setEmail("test@example.com");
        user1.setLastName("Doe");
        user1.setFirstName("John");
        user1.setPassword("password123");
        user1.setAdmin(true);
        user1.setCreatedAt(LocalDateTime.now());
        user1.setUpdatedAt(LocalDateTime.now());

        User user2 = new User();
        user2.setId(1L);
        user2.setEmail("test@example.com");
        user2.setLastName("Doe");
        user2.setFirstName("John");
        user2.setPassword("password123");
        user2.setAdmin(true);
        user2.setCreatedAt(LocalDateTime.now());
        user2.setUpdatedAt(LocalDateTime.now());

        User user3 = new User();
        user3.setId(2L);
        user3.setEmail("different@example.com");
        user3.setLastName("Smith");
        user3.setFirstName("Jane");
        user3.setPassword("password123");
        user3.setAdmin(false);
        user3.setCreatedAt(LocalDateTime.now());
        user3.setUpdatedAt(LocalDateTime.now());

        assertEquals(user1, user2); // Couvre l'égalité
        assertNotEquals(user1, user3); // Couvre la non-égalité
        assertEquals(user1.hashCode(), user2.hashCode()); // Couvre le même hash code
        assertNotEquals(user1.hashCode(), user3.hashCode()); // Couvre des hash codes différents
        assertEquals(user1, user1); // Couvre l'égalité avec le même objet
        assertNotEquals(user1, null); // Couvre la comparaison avec null
        assertNotEquals(user1, new Object()); // Couvre la comparaison avec une classe différente
    }

    @Test
    public void testToString() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setPassword("password123");
        user.setAdmin(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        String expected = "User(id=1, email=test@example.com, lastName=Doe, firstName=John, password=password123, admin=true, createdAt=" + user.getCreatedAt() + ", updatedAt=" + user.getUpdatedAt() + ")";
        assertEquals(expected, user.toString());
    }

    @Test
    public void testCanEqual() {
        User user1 = new User();
        user1.setId(1L);
        user1.setEmail("test@example.com");
        user1.setLastName("Doe");
        user1.setFirstName("John");
        user1.setPassword("password123");
        user1.setAdmin(true);
        user1.setCreatedAt(LocalDateTime.now());
        user1.setUpdatedAt(LocalDateTime.now());

        User user2 = new User();
        assertTrue(user1.canEqual(user2));
        assertFalse(user1.canEqual(null));
        assertFalse(user1.canEqual(new Object()));
    }

    @Test
    public void testConstructorWithAllArgs() {
        LocalDateTime now = LocalDateTime.now();
        User user = new User(1L, "test@example.com", "Doe", "John", "password123", true, now, now);

        assertEquals(1L, user.getId());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("Doe", user.getLastName());
        assertEquals("John", user.getFirstName());
        assertEquals("password123", user.getPassword());
        assertTrue(user.isAdmin());
        assertEquals(now, user.getCreatedAt());
        assertEquals(now, user.getUpdatedAt());
    }

    @Test
    public void testConstructorWithArgs() {
        User user = new User("test@example.com", "Doe", "John", "password123", true);

        assertEquals("test@example.com", user.getEmail());
        assertEquals("Doe", user.getLastName());
        assertEquals("John", user.getFirstName());
        assertEquals("password123", user.getPassword());
        assertTrue(user.isAdmin());
    }

    @Test
    public void testSetEmail() {
        User user = new User();
        user.setEmail("test@example.com");
        assertEquals("test@example.com", user.getEmail());
    }

    @Test
    public void testSetLastName() {
        User user = new User();
        user.setLastName("Doe");
        assertEquals("Doe", user.getLastName());
    }

    @Test
    public void testSetFirstName() {
        User user = new User();
        user.setFirstName("John");
        assertEquals("John", user.getFirstName());
    }

    @Test
    public void testSetPassword() {
        User user = new User();
        user.setPassword("password123");
        assertEquals("password123", user.getPassword());
    }

    @Test
    public void testSetAdmin() {
        User user = new User();
        user.setAdmin(true);
        assertTrue(user.isAdmin());
    }

    @Test
    public void testSetCreatedAt() {
        LocalDateTime now = LocalDateTime.now();
        User user = new User();
        user.setCreatedAt(now);
        assertEquals(now, user.getCreatedAt());
    }

    @Test
    public void testSetUpdatedAt() {
        LocalDateTime now = LocalDateTime.now();
        User user = new User();
        user.setUpdatedAt(now);
        assertEquals(now, user.getUpdatedAt());
    }
}
