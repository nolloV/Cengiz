package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindById_Success() {
        User user = new User();
        UserDto userDto = new UserDto();
        when(userService.findById(anyLong())).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        ResponseEntity<?> response = userController.findById("1");

        assertEquals(200, response.getStatusCodeValue());
        verify(userService, times(1)).findById(anyLong());
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    public void testFindById_NotFound() {
        when(userService.findById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = userController.findById("1");

        assertEquals(404, response.getStatusCodeValue());
        verify(userService, times(1)).findById(anyLong());
    }

    @Test
    public void testFindById_BadRequest() {
        ResponseEntity<?> response = userController.findById("invalid");

        assertEquals(400, response.getStatusCodeValue());
        verify(userService, never()).findById(anyLong());
    }

    @Test
    public void testDelete_Success() {
        User user = new User();
        user.setEmail("test@example.com");
        when(userService.findById(anyLong())).thenReturn(user);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<?> response = userController.save("1");

        assertEquals(200, response.getStatusCodeValue());
        verify(userService, times(1)).findById(anyLong());
        verify(userService, times(1)).delete(anyLong());
    }

    @Test
    public void testDelete_NotFound() {
        when(userService.findById(anyLong())).thenReturn(null);

        ResponseEntity<?> response = userController.save("1");

        assertEquals(404, response.getStatusCodeValue());
        verify(userService, times(1)).findById(anyLong());
    }

    @Test
    public void testDelete_Unauthorized() {
        User user = new User();
        user.setEmail("test@example.com");
        when(userService.findById(anyLong())).thenReturn(user);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("other@example.com");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<?> response = userController.save("1");

        assertEquals(401, response.getStatusCodeValue());
        verify(userService, times(1)).findById(anyLong());
    }

    @Test
    public void testDelete_BadRequest() {
        ResponseEntity<?> response = userController.save("invalid");

        assertEquals(400, response.getStatusCodeValue());
        verify(userService, never()).findById(anyLong());
    }
}
