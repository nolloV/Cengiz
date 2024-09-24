package com.openclassrooms.starterjwt.repository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.openclassrooms.starterjwt.models.User;

public class UserRepositoryTest {

    @Mock
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("test@example.com");
        user.setLastName("Doe");
        user.setFirstName("John");
        user.setPassword("password");
        user.setAdmin(true);
    }

    @Test
    public void testFindByEmail() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        Optional<User> foundUser = userRepository.findByEmail("test@example.com");
        assertTrue(foundUser.isPresent());
        assertEquals(user.getEmail(), foundUser.get().getEmail());

        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    public void testExistsByEmail() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        Boolean exists = userRepository.existsByEmail("test@example.com");
        assertTrue(exists);

        verify(userRepository, times(1)).existsByEmail("test@example.com");
    }

    @Test
    public void testFindByEmail_NotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        Optional<User> foundUser = userRepository.findByEmail("notfound@example.com");
        assertFalse(foundUser.isPresent());

        verify(userRepository, times(1)).findByEmail("notfound@example.com");
    }

    @Test
    public void testExistsByEmail_NotFound() {
        when(userRepository.existsByEmail("notfound@example.com")).thenReturn(false);

        Boolean exists = userRepository.existsByEmail("notfound@example.com");
        assertFalse(exists);

        verify(userRepository, times(1)).existsByEmail("notfound@example.com");
    }
}
