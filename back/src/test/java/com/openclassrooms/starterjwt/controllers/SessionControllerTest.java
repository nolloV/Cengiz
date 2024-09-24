package com.openclassrooms.starterjwt.controllers;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

public class SessionControllerTest {

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindById_Success() {
        Session session = new Session();
        SessionDto sessionDto = new SessionDto();

        when(sessionService.getById(anyLong())).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sessionDto, response.getBody());
    }

    @Test
    public void testFindById_NotFound() {
        when(sessionService.getById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    public void testFindById_BadRequest() {
        ResponseEntity<?> response = sessionController.findById("invalid");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    public void testFindAll() {
        List<Session> sessions = Arrays.asList(new Session(), new Session());
        List<SessionDto> sessionDtos = Arrays.asList(new SessionDto(), new SessionDto());

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(anyList())).thenReturn(sessionDtos);

        ResponseEntity<?> response = sessionController.findAll();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sessionDtos, response.getBody());
    }

    @Test
    public void testCreate() {
        SessionDto sessionDto = new SessionDto();
        Session session = new Session();

        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.create(any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.create(sessionDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sessionDto, response.getBody());
    }

    @Test
    public void testUpdate_Success() {
        SessionDto sessionDto = new SessionDto();
        Session session = new Session();

        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.update(anyLong(), any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.update("1", sessionDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sessionDto, response.getBody());
    }

    @Test
    public void testUpdate_BadRequest() {
        SessionDto sessionDto = new SessionDto();

        ResponseEntity<?> response = sessionController.update("invalid", sessionDto);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    public void testDelete_Success() {
        Session session = new Session();

        when(sessionService.getById(anyLong())).thenReturn(session);
        doNothing().when(sessionService).delete(anyLong());

        ResponseEntity<?> response = sessionController.save("1");

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void testDelete_NotFound() {
        when(sessionService.getById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = sessionController.save("1");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    public void testDelete_BadRequest() {
        ResponseEntity<?> response = sessionController.save("invalid");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    public void testParticipate_Success() {
        doNothing().when(sessionService).participate(anyLong(), anyLong());

        ResponseEntity<?> response = sessionController.participate("1", "1");

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void testParticipate_BadRequest() {
        ResponseEntity<?> response = sessionController.participate("invalid", "1");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    public void testNoLongerParticipate_Success() {
        doNothing().when(sessionService).noLongerParticipate(anyLong(), anyLong());

        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "1");

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void testNoLongerParticipate_BadRequest() {
        ResponseEntity<?> response = sessionController.noLongerParticipate("invalid", "1");

        assertEquals(400, response.getStatusCodeValue());
    }
}
