package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreate() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session createdSession = sessionService.create(session);

        assertEquals(session, createdSession);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    public void testDelete() {
        doNothing().when(sessionRepository).deleteById(anyLong());

        sessionService.delete(1L);

        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testFindAll() {
        List<Session> sessions = Arrays.asList(new Session(), new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> foundSessions = sessionService.findAll();

        assertEquals(sessions, foundSessions);
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    public void testGetById_Success() {
        Session session = new Session();
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));

        Session foundSession = sessionService.getById(1L);

        assertEquals(session, foundSession);
        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetById_NotFound() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());

        Session foundSession = sessionService.getById(1L);

        assertNull(foundSession);
        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    public void testUpdate() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session updatedSession = sessionService.update(1L, session);

        assertEquals(session, updatedSession);
        assertEquals(1L, session.getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
        public void testParticipate_Success() {
            Session session = new Session();
            session.setUsers(new ArrayList<>()); // Assurez-vous que la liste des utilisateurs n'est pas null
            User user = new User();
            when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));
            when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

            sessionService.participate(1L, 1L);

            assertTrue(session.getUsers().contains(user));
            verify(sessionRepository, times(1)).save(session);
        }

    @Test
    public void testParticipate_NotFound() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        NotFoundException thrown = assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
        assertNotNull(thrown);
    }

    @Test
    public void testParticipate_AlreadyParticipate() {
        Session session = new Session();
        User user = new User();
        user.setId(1L);
        session.setUsers(Collections.singletonList(user));
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        BadRequestException thrown = assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
        assertNotNull(thrown);
    }

    @Test
    public void testNoLongerParticipate_Success() {
        Session session = new Session();
        User user = new User();
        user.setId(1L);
        session.setUsers(Collections.singletonList(user));
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(1L, 1L);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    public void testNoLongerParticipate_NotFound() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());

        NotFoundException thrown = assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 1L));
        assertNotNull(thrown);
    }

    @Test
    public void testNoLongerParticipate_NotParticipating() {
        Session session = new Session();
        session.setUsers(new ArrayList<>()); // Assurez-vous que la liste des utilisateurs n'est pas null
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));

        BadRequestException thrown = assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));
        assertNotNull(thrown);
    }
}
