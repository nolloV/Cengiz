package com.openclassrooms.starterjwt.controllers;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

public class TeacherControllerTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindById_Success() {
        Teacher teacher = new Teacher();
        TeacherDto teacherDto = new TeacherDto();
        when(teacherService.findById(anyLong())).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        ResponseEntity<?> response = teacherController.findById("1");

        assertEquals(200, response.getStatusCodeValue());
        verify(teacherService, times(1)).findById(anyLong());
        verify(teacherMapper, times(1)).toDto(teacher);
    }

    @Test
    public void testFindById_NotFound() {
        when(teacherService.findById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = teacherController.findById("1");

        assertEquals(404, response.getStatusCodeValue());
        verify(teacherService, times(1)).findById(anyLong());
        verify(teacherMapper, never()).toDto((Teacher) any());
    }

    @Test
    public void testFindById_BadRequest() {
        ResponseEntity<?> response = teacherController.findById("invalid");

        assertEquals(400, response.getStatusCodeValue());
        verify(teacherService, never()).findById(anyLong());
        verify(teacherMapper, never()).toDto((Teacher) any());
    }

    @Test
    public void testFindAll() {
        List<Teacher> teachers = Collections.singletonList(new Teacher());
        List<TeacherDto> teacherDtos = Collections.singletonList(new TeacherDto());
        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);

        ResponseEntity<?> response = teacherController.findAll();

        assertEquals(200, response.getStatusCodeValue());
        verify(teacherService, times(1)).findAll();
        verify(teacherMapper, times(1)).toDto(teachers);
    }
}
