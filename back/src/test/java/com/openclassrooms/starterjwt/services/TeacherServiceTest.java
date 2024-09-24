package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindAll() {
        List<Teacher> teachers = Arrays.asList(new Teacher(), new Teacher());
        when(teacherRepository.findAll()).thenReturn(teachers);

        List<Teacher> foundTeachers = teacherService.findAll();

        assertEquals(teachers, foundTeachers);
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    public void testFindById_Success() {
        Teacher teacher = new Teacher();
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.of(teacher));

        Teacher foundTeacher = teacherService.findById(1L);

        assertEquals(teacher, foundTeacher);
        verify(teacherRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindById_NotFound() {
        when(teacherRepository.findById(anyLong())).thenReturn(Optional.empty());

        Teacher foundTeacher = teacherService.findById(1L);

        assertNull(foundTeacher);
        verify(teacherRepository, times(1)).findById(1L);
    }
}
