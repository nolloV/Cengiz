package com.openclassrooms.starterjwt.models;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
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

public class SessionTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidSession() {
        Session session = new Session();
        session.setName("Valid Session");
        session.setDate(new Date());
        session.setDescription("This is a valid session description.");
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User())); // Utilisation de Arrays.asList
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertTrue(violations.isEmpty());
    }

    @Test
    public void testInvalidSessionName() {
        Session session = new Session();
        session.setName(""); // Invalid name
        session.setDate(new Date());
        session.setDescription("This is a valid session description.");
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User())); // Utilisation de Arrays.asList
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidSessionDescription() {
        Session session = new Session();
        session.setName("Valid Session");
        session.setDate(new Date());
        session.setDescription(null); // Invalid description (null)
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User())); // Utilisation de Arrays.asList
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertFalse(violations.isEmpty()); // Vérifie qu'il y a des violations
        assertEquals(1, violations.size()); // Vérifie qu'il y a exactement une violation
        assertEquals("ne doit pas être nul", violations.iterator().next().getMessage()); // Vérifie le message de la violation
    }

    @Test
    public void testInvalidSessionDate() {
        Session session = new Session();
        session.setName("Valid Session");
        session.setDate(null); // Invalid date
        session.setDescription("This is a valid session description.");
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User())); // Utilisation de Arrays.asList
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertFalse(violations.isEmpty());
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être nul", violations.iterator().next().getMessage());
    }

    @Test
    public void testEquals() {
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Valid Session");
        session1.setDate(new Date());
        session1.setDescription("This is a valid session description.");
        session1.setTeacher(new Teacher());
        session1.setUsers(Arrays.asList(new User()));
        session1.setCreatedAt(LocalDateTime.now());
        session1.setUpdatedAt(LocalDateTime.now());

        Session session2 = new Session();
        session2.setId(1L);
        session2.setName("Valid Session");
        session2.setDate(new Date());
        session2.setDescription("This is a valid session description.");
        session2.setTeacher(new Teacher());
        session2.setUsers(Arrays.asList(new User()));
        session2.setCreatedAt(LocalDateTime.now());
        session2.setUpdatedAt(LocalDateTime.now());

        assertEquals(session1, session2);
    }

    @Test
    public void testNotEquals() {
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Valid Session");
        session1.setDate(new Date());
        session1.setDescription("This is a valid session description.");
        session1.setTeacher(new Teacher());
        session1.setUsers(Arrays.asList(new User()));
        session1.setCreatedAt(LocalDateTime.now());
        session1.setUpdatedAt(LocalDateTime.now());

        Session session2 = new Session();
        session2.setId(2L);
        session2.setName("Different Session");
        session2.setDate(new Date());
        session2.setDescription("This is a different session description.");
        session2.setTeacher(new Teacher());
        session2.setUsers(Arrays.asList(new User()));
        session2.setCreatedAt(LocalDateTime.now());
        session2.setUpdatedAt(LocalDateTime.now());

        assertNotEquals(session1, session2);
    }

    @Test
    public void testEquals_Null() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Valid Session");
        session.setDate(new Date());
        session.setDescription("This is a valid session description.");
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User()));
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        assertNotEquals(session, null);
    }

    @Test
    public void testEquals_DifferentClass() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Valid Session");
        session.setDate(new Date());
        session.setDescription("This is a valid session description.");
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User()));
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        assertNotEquals(session, new Object());
    }

    @Test
    public void testEquals_SameObject() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Valid Session");
        session.setDate(new Date());
        session.setDescription("This is a valid session description.");
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User()));
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        assertEquals(session, session);
    }

    @Test
    public void testHashCode() {
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Valid Session");
        session1.setDate(new Date());
        session1.setDescription("This is a valid session description.");
        session1.setTeacher(new Teacher());
        session1.setUsers(Arrays.asList(new User()));
        session1.setCreatedAt(LocalDateTime.now());
        session1.setUpdatedAt(LocalDateTime.now());

        Session session2 = new Session();
        session2.setId(1L);
        session2.setName("Valid Session");
        session2.setDate(new Date());
        session2.setDescription("This is a valid session description.");
        session2.setTeacher(new Teacher());
        session2.setUsers(Arrays.asList(new User()));
        session2.setCreatedAt(LocalDateTime.now());
        session2.setUpdatedAt(LocalDateTime.now());

        assertEquals(session1.hashCode(), session2.hashCode());
    }

    @Test
    public void testHashCode_Different() {
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Valid Session");
        session1.setDate(new Date());
        session1.setDescription("This is a valid session description.");
        session1.setTeacher(new Teacher());
        session1.setUsers(Arrays.asList(new User()));
        session1.setCreatedAt(LocalDateTime.now());
        session1.setUpdatedAt(LocalDateTime.now());

        Session session2 = new Session();
        session2.setId(2L);
        session2.setName("Different Session");
        session2.setDate(new Date());
        session2.setDescription("This is a different session description.");
        session2.setTeacher(new Teacher());
        session2.setUsers(Arrays.asList(new User()));
        session2.setCreatedAt(LocalDateTime.now());
        session2.setUpdatedAt(LocalDateTime.now());

        assertNotEquals(session1.hashCode(), session2.hashCode());
    }

    @Test
    public void testToString() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Valid Session");
        session.setDate(new Date());
        session.setDescription("This is a valid session description.");
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User()));
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        String expected = "Session(id=1, name=Valid Session, date=" + session.getDate() + ", description=This is a valid session description., teacher=" + session.getTeacher() + ", users=" + session.getUsers() + ", createdAt=" + session.getCreatedAt() + ", updatedAt=" + session.getUpdatedAt() + ")";
        assertEquals(expected, session.toString());
    }

    @Test
    public void testCanEqual() {
        Session session1 = new Session();
        session1.setId(1L);
        session1.setName("Valid Session");
        session1.setDate(new Date());
        session1.setDescription("This is a valid session description.");
        session1.setTeacher(new Teacher());
        session1.setUsers(Arrays.asList(new User()));
        session1.setCreatedAt(LocalDateTime.now());
        session1.setUpdatedAt(LocalDateTime.now());

        Session session2 = new Session();
        assertTrue(session1.canEqual(session2));
    }
}
