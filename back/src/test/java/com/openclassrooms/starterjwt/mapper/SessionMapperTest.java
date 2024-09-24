package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.*;

public class SessionMapperTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @InjectMocks
    private final SessionMapper sessionMapper = Mappers.getMapper(SessionMapper.class);

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testToEntity() {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setDescription("Test Description");
        sessionDto.setTeacher_id(1L);
        sessionDto.setUsers(Arrays.asList(1L, 2L));

        Teacher teacher = new Teacher();
        teacher.setId(1L);

        User user1 = new User();
        user1.setId(1L);

        User user2 = new User();
        user2.setId(2L);

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(userService.findById(1L)).thenReturn(user1);
        when(userService.findById(2L)).thenReturn(user2);

        Session session = sessionMapper.toEntity(sessionDto);

        assertNotNull(session);
        assertEquals(sessionDto.getDescription(), session.getDescription());
        assertEquals(teacher, session.getTeacher());
        assertEquals(2, session.getUsers().size());
        assertTrue(session.getUsers().contains(user1));
        assertTrue(session.getUsers().contains(user2));
    }

    @Test
    public void testToDto() {
        Session session = new Session();
        session.setDescription("Test Description");

        Teacher teacher = new Teacher();
        teacher.setId(1L);
        session.setTeacher(teacher);

        User user1 = new User();
        user1.setId(1L);

        User user2 = new User();
        user2.setId(2L);

        session.setUsers(Arrays.asList(user1, user2));

        SessionDto sessionDto = sessionMapper.toDto(session);

        assertNotNull(sessionDto);
        assertEquals(session.getDescription(), sessionDto.getDescription());
        assertEquals(teacher.getId(), sessionDto.getTeacher_id());
        assertEquals(2, sessionDto.getUsers().size());
        assertTrue(sessionDto.getUsers().contains(1L));
        assertTrue(sessionDto.getUsers().contains(2L));
    }
}
