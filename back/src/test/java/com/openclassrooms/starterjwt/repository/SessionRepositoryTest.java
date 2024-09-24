package com.openclassrooms.starterjwt.repository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.openclassrooms.starterjwt.models.Session;

public class SessionRepositoryTest {

    @Mock
    private SessionRepository sessionRepository;

    private Session session;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        session = new Session();
        session.setId(1L);
        session.setName("Test Session");
    }

    @Test
    public void testFindById() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        Optional<Session> foundSession = sessionRepository.findById(1L);
        assertTrue(foundSession.isPresent());
        assertEquals(session.getId(), foundSession.get().getId());

        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    public void testSaveSession() {
        when(sessionRepository.save(session)).thenReturn(session);

        Session savedSession = sessionRepository.save(session);
        assertNotNull(savedSession);
        assertEquals(session.getId(), savedSession.getId());

        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    public void testDeleteSession() {
        doNothing().when(sessionRepository).deleteById(1L);

        sessionRepository.deleteById(1L);

        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testFindById_NotFound() {
        when(sessionRepository.findById(2L)).thenReturn(Optional.empty());

        Optional<Session> foundSession = sessionRepository.findById(2L);
        assertFalse(foundSession.isPresent());

        verify(sessionRepository, times(1)).findById(2L);
    }
}
