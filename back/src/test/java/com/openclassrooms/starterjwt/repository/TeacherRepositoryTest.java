package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TeacherRepositoryTest {

    @Mock
    private TeacherRepository teacherRepository;

    private Teacher teacher;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        teacher = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .build();
    }

    @Test
    public void testFindById() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Optional<Teacher> foundTeacher = teacherRepository.findById(1L);
        assertTrue(foundTeacher.isPresent());
        assertEquals(teacher.getId(), foundTeacher.get().getId());

        verify(teacherRepository, times(1)).findById(1L);
    }

    @Test
    public void testSaveTeacher() {
        when(teacherRepository.save(teacher)).thenReturn(teacher);

        Teacher savedTeacher = teacherRepository.save(teacher);
        assertNotNull(savedTeacher);
        assertEquals(teacher.getId(), savedTeacher.getId());

        verify(teacherRepository, times(1)).save(teacher);
    }

    @Test
    public void testDeleteTeacher() {
        doNothing().when(teacherRepository).deleteById(1L);

        teacherRepository.deleteById(1L);

        verify(teacherRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testFindById_NotFound() {
        when(teacherRepository.findById(2L)).thenReturn(Optional.empty());

        Optional<Teacher> foundTeacher = teacherRepository.findById(2L);
        assertFalse(foundTeacher.isPresent());

        verify(teacherRepository, times(1)).findById(2L);
    }
}