package com.openclassrooms.starterjwt.controllers.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    private Session session;

    @BeforeEach
    public void setup() {
        sessionRepository.deleteAll();  // Clean up the sessions before each test
        userRepository.deleteAll();     // Clean up the users before each test
        session = Session.builder()
                .name("Test Session")
                .date(new Date())
                .description("This is a test session.")
                .build();
        sessionRepository.save(session);
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})  // Simulate an authenticated user with role USER
    public void testFindById() throws Exception {
        mockMvc.perform(get("/api/session/{id}", session.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Test Session")))
                .andExpect(jsonPath("$.description", is("This is a test session.")));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    public void testFindAll() throws Exception {
        mockMvc.perform(get("/api/session")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Test Session")));
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})  // Simulate an authenticated admin user
    public void testCreateSession() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("New Test Session");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("This is a new test session.");
        sessionDto.setTeacher_id(1L);  // Add valid teacher_id to pass validation

        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("New Test Session")));
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})  // Simulate an authenticated admin user
    public void testUpdateSession() throws Exception {
        SessionDto updatedSessionDto = new SessionDto();
        updatedSessionDto.setName("Updated Test Session");
        updatedSessionDto.setDate(new Date());
        updatedSessionDto.setDescription("This is an updated test session.");
        updatedSessionDto.setTeacher_id(1L);  // Add valid teacher_id to pass validation

        mockMvc.perform(put("/api/session/{id}", session.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedSessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Test Session")))
                .andExpect(jsonPath("$.description", is("This is an updated test session.")));
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})  // Simulate an authenticated admin user
    public void testDeleteSession() throws Exception {
        mockMvc.perform(delete("/api/session/{id}", session.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/session/{id}", session.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})  // Simulate an authenticated user
    public void testParticipateInSession() throws Exception {
        // Create a test user with a unique email
        User user = new User();
        user.setEmail("testuser_" + System.currentTimeMillis() + "@example.com");  // Unique email
        user.setFirstName("Test");
        user.setLastName("User");
        user.setPassword("password123");
        user.setAdmin(false);
        userRepository.save(user);

        Long userId = user.getId();  // Get the ID of the user

        mockMvc.perform(post("/api/session/{id}/participate/{userId}", session.getId(), userId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})  // Simulate an authenticated user
    public void testNoLongerParticipateInSession() throws Exception {
        // Create a test user with a unique email
        User user = new User();
        user.setEmail("testuser_" + System.currentTimeMillis() + "@example.com");  // Unique email
        user.setFirstName("Test");
        user.setLastName("User");
        user.setPassword("password123");
        user.setAdmin(false);
        userRepository.save(user);

        // Add the user to the session
        session.setUsers(Collections.singletonList(user));
        sessionRepository.save(session);

        Long userId = user.getId();  // Get the ID of the user

        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", session.getId(), userId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
