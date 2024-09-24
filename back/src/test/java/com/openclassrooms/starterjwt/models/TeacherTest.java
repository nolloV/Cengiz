package com.openclassrooms.starterjwt.models;

import java.time.LocalDateTime;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TeacherTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidTeacher() {
        Teacher teacher = new Teacher();
        teacher.setLastName("Doe");
        teacher.setFirstName("John");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        Set<ConstraintViolation<Teacher>> violations = validator.validate(teacher);
        assertTrue(violations.isEmpty());
    }

    @Test
    public void testInvalidTeacher_LastNameBlank() {
        Teacher teacher = new Teacher();
        teacher.setLastName("");
        teacher.setFirstName("John");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        Set<ConstraintViolation<Teacher>> violations = validator.validate(teacher);
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testInvalidTeacher_FirstNameBlank() {
        Teacher teacher = new Teacher();
        teacher.setLastName("Doe");
        teacher.setFirstName("");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        Set<ConstraintViolation<Teacher>> violations = validator.validate(teacher);
        assertEquals(1, violations.size());
        assertEquals("ne doit pas être vide", violations.iterator().next().getMessage());
    }

    @Test
    public void testEquals() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setLastName("Doe");
        teacher1.setFirstName("John");
        teacher1.setCreatedAt(LocalDateTime.now());
        teacher1.setUpdatedAt(LocalDateTime.now());

        Teacher teacher2 = new Teacher();
        teacher2.setId(1L);
        teacher2.setLastName("Doe");
        teacher2.setFirstName("John");
        teacher2.setCreatedAt(LocalDateTime.now());
        teacher2.setUpdatedAt(LocalDateTime.now());

        assertEquals(teacher1, teacher2);
    }

    @Test
    public void testNotEquals() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setLastName("Doe");
        teacher1.setFirstName("John");
        teacher1.setCreatedAt(LocalDateTime.now());
        teacher1.setUpdatedAt(LocalDateTime.now());

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setLastName("Smith");
        teacher2.setFirstName("Jane");
        teacher2.setCreatedAt(LocalDateTime.now());
        teacher2.setUpdatedAt(LocalDateTime.now());

        assertNotEquals(teacher1, teacher2);
    }

    @Test
    public void testEquals_Null() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Doe");
        teacher.setFirstName("John");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        assertNotEquals(teacher, null);
    }

    @Test
    public void testEquals_DifferentClass() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Doe");
        teacher.setFirstName("John");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        assertNotEquals(teacher, new Object());
    }

    @Test
    public void testEquals_SameObject() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Doe");
        teacher.setFirstName("John");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        assertEquals(teacher, teacher);
    }

    @Test
    public void testHashCode() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setLastName("Doe");
        teacher1.setFirstName("John");
        teacher1.setCreatedAt(LocalDateTime.now());
        teacher1.setUpdatedAt(LocalDateTime.now());

        Teacher teacher2 = new Teacher();
        teacher2.setId(1L);
        teacher2.setLastName("Doe");
        teacher2.setFirstName("John");
        teacher2.setCreatedAt(LocalDateTime.now());
        teacher2.setUpdatedAt(LocalDateTime.now());

        assertEquals(teacher1.hashCode(), teacher2.hashCode());
    }

    @Test
    public void testHashCode_Different() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setLastName("Doe");
        teacher1.setFirstName("John");
        teacher1.setCreatedAt(LocalDateTime.now());
        teacher1.setUpdatedAt(LocalDateTime.now());

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setLastName("Smith");
        teacher2.setFirstName("Jane");
        teacher2.setCreatedAt(LocalDateTime.now());
        teacher2.setUpdatedAt(LocalDateTime.now());

        assertNotEquals(teacher1.hashCode(), teacher2.hashCode());
    }

    @Test
    public void testToString() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Doe");
        teacher.setFirstName("John");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        String expected = "Teacher(id=1, lastName=Doe, firstName=John, createdAt=" + teacher.getCreatedAt() + ", updatedAt=" + teacher.getUpdatedAt() + ")";
        assertEquals(expected, teacher.toString());
    }

    @Test
    public void testCanEqual() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setLastName("Doe");
        teacher1.setFirstName("John");
        teacher1.setCreatedAt(LocalDateTime.now());
        teacher1.setUpdatedAt(LocalDateTime.now());

        Teacher teacher2 = new Teacher();
        assertTrue(teacher1.canEqual(teacher2));
    }
}
