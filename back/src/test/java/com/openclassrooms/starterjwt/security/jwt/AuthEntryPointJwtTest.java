package com.openclassrooms.starterjwt.security.jwt;

import static org.mockito.Mockito.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.*;

public class AuthEntryPointJwtTest {

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    private ByteArrayOutputStream byteArrayOutputStream;
    private ServletOutputStream servletOutputStream;

    @BeforeEach
    public void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);
        byteArrayOutputStream = new ByteArrayOutputStream();
        servletOutputStream = new ServletOutputStream() {
            @Override
            public void write(int b) throws IOException {
                byteArrayOutputStream.write(b);
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setWriteListener(WriteListener writeListener) {
                // No-op for testing
            }
        };
        when(response.getOutputStream()).thenReturn(servletOutputStream);
    }

    @Test
    public void testCommence() throws IOException, ServletException {
        // Arrange
        when(authException.getMessage()).thenReturn("Unauthorized error");
        when(request.getServletPath()).thenReturn("/test");

        // Act
        authEntryPointJwt.commence(request, response, authException);

        // Assert
        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // Capture the written value
        String jsonResponse = byteArrayOutputStream.toString();
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> body = mapper.readValue(jsonResponse, Map.class);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, body.get("status"));
        assertEquals("Unauthorized", body.get("error"));
        assertEquals("Unauthorized error", body.get("message"));
        assertEquals("/test", body.get("path"));
    }
}
