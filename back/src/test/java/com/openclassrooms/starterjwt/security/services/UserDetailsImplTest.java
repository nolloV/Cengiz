package com.openclassrooms.starterjwt.security.services;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

public class UserDetailsImplTest {

    private UserDetailsImpl userDetails;

    @BeforeEach
    public void setUp() {
        userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testuser")
                .firstName("Test")
                .lastName("User")
                .admin(true)
                .password("password")
                .build();
    }

    @Test
    public void testGetId() {
        assertEquals(1L, userDetails.getId());
    }

    @Test
    public void testGetUsername() {
        assertEquals("testuser", userDetails.getUsername());
    }

    @Test
    public void testGetFirstName() {
        assertEquals("Test", userDetails.getFirstName());
    }

    @Test
    public void testGetLastName() {
        assertEquals("User", userDetails.getLastName());
    }

    @Test
    public void testIsAdmin() {
        assertTrue(userDetails.getAdmin());
    }

    @Test
    public void testGetPassword() {
        assertEquals("password", userDetails.getPassword());
    }

    @Test
    public void testGetAuthorities() {
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
    }

    @Test
    public void testIsAccountNonExpired() {
        assertTrue(userDetails.isAccountNonExpired());
    }

    @Test
    public void testIsAccountNonLocked() {
        assertTrue(userDetails.isAccountNonLocked());
    }

    @Test
    public void testIsCredentialsNonExpired() {
        assertTrue(userDetails.isCredentialsNonExpired());
    }

    @Test
    public void testIsEnabled() {
        assertTrue(userDetails.isEnabled());
    }

    @Test
    public void testEquals_SameObject() {
        assertTrue(userDetails.equals(userDetails));
    }

    @Test
    public void testEquals_DifferentObject() {
        UserDetailsImpl otherUserDetails = UserDetailsImpl.builder()
                .id(2L)
                .username("otheruser")
                .firstName("Other")
                .lastName("User")
                .admin(false)
                .password("otherpassword")
                .build();
        assertFalse(userDetails.equals(otherUserDetails));
    }

    @Test
    public void testEquals_NullObject() {
        assertFalse(userDetails.equals(null));
    }

    @Test
    public void testEquals_DifferentClass() {
        assertFalse(userDetails.equals(new Object()));
    }

    @Test
    public void testEquals_SameId() {
        UserDetailsImpl otherUserDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("otheruser")
                .firstName("Other")
                .lastName("User")
                .admin(false)
                .password("otherpassword")
                .build();
        assertTrue(userDetails.equals(otherUserDetails));
    }
}
