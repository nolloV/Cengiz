package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherMapperTest {

    private TeacherMapper teacherMapper;

    @BeforeEach
    public void setUp() {
        teacherMapper = Mappers.getMapper(TeacherMapper.class);
    }

    @Test
    public void testToEntity() {
        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setFirstName("John");
        teacherDto.setLastName("Doe");
        teacherDto.setCreatedAt(LocalDateTime.now());
        teacherDto.setUpdatedAt(LocalDateTime.now());

        Teacher teacher = teacherMapper.toEntity(teacherDto);

        assertNotNull(teacher);
        assertEquals(teacherDto.getId(), teacher.getId());
        assertEquals(teacherDto.getFirstName(), teacher.getFirstName());
        assertEquals(teacherDto.getLastName(), teacher.getLastName());
        assertEquals(teacherDto.getCreatedAt(), teacher.getCreatedAt());
        assertEquals(teacherDto.getUpdatedAt(), teacher.getUpdatedAt());
    }

    @Test
    public void testToDto() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("John");
        teacher.setLastName("Doe");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        TeacherDto teacherDto = teacherMapper.toDto(teacher);

        assertNotNull(teacherDto);
        assertEquals(teacher.getId(), teacherDto.getId());
        assertEquals(teacher.getFirstName(), teacherDto.getFirstName());
        assertEquals(teacher.getLastName(), teacherDto.getLastName());
        assertEquals(teacher.getCreatedAt(), teacherDto.getCreatedAt());
        assertEquals(teacher.getUpdatedAt(), teacherDto.getUpdatedAt());
    }

    @Test
    public void testToEntityList() {
        TeacherDto teacherDto1 = new TeacherDto();
        teacherDto1.setId(1L);
        teacherDto1.setFirstName("John");
        teacherDto1.setLastName("Doe");
        teacherDto1.setCreatedAt(LocalDateTime.now());
        teacherDto1.setUpdatedAt(LocalDateTime.now());

        TeacherDto teacherDto2 = new TeacherDto();
        teacherDto2.setId(2L);
        teacherDto2.setFirstName("Jane");
        teacherDto2.setLastName("Smith");
        teacherDto2.setCreatedAt(LocalDateTime.now());
        teacherDto2.setUpdatedAt(LocalDateTime.now());

        List<TeacherDto> teacherDtoList = Arrays.asList(teacherDto1, teacherDto2);

        List<Teacher> teacherList = teacherMapper.toEntity(teacherDtoList);

        assertNotNull(teacherList);
        assertEquals(2, teacherList.size());
        assertEquals(teacherDto1.getId(), teacherList.get(0).getId());
        assertEquals(teacherDto2.getId(), teacherList.get(1).getId());
    }

    @Test
    public void testToDtoList() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("John");
        teacher1.setLastName("Doe");
        teacher1.setCreatedAt(LocalDateTime.now());
        teacher1.setUpdatedAt(LocalDateTime.now());

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("Jane");
        teacher2.setLastName("Smith");
        teacher2.setCreatedAt(LocalDateTime.now());
        teacher2.setUpdatedAt(LocalDateTime.now());

        List<Teacher> teacherList = Arrays.asList(teacher1, teacher2);

        List<TeacherDto> teacherDtoList = teacherMapper.toDto(teacherList);

        assertNotNull(teacherDtoList);
        assertEquals(2, teacherDtoList.size());
        assertEquals(teacher1.getId(), teacherDtoList.get(0).getId());
        assertEquals(teacher2.getId(), teacherDtoList.get(1).getId());
    }
}