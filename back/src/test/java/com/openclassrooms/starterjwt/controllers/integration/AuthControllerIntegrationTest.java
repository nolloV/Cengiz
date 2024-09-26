package com.openclassrooms.starterjwt.controllers.integration;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional  // Gère les transactions, tout sera rollback après chaque test
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Nettoyage de la base de données avant chaque test
        userRepository.deleteAll();
    }

    @Test
    void shouldFailRegisteringUserWithExistingEmail() throws Exception {
        // Crée un utilisateur existant dans la base de données
        userRepository.save(new com.openclassrooms.starterjwt.models.User(
                "test@example.com",
                "Doe",
                "John",
                passwordEncoder.encode("password"),
                false
        ));

        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("Jane");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        // Effectue une requête POST vers /api/auth/register
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andReturn();

        // Vérifie le message d'erreur dans la réponse
        String responseContent = result.getResponse().getContentAsString();
        assertThat(responseContent).contains("Error: Email is already taken!");
    }

    @Test
    void shouldAuthenticateUserSuccessfully() throws Exception {
        // Enregistre d'abord un utilisateur
        com.openclassrooms.starterjwt.models.User user = new com.openclassrooms.starterjwt.models.User(
                "test@example.com",
                "Doe",
                "John",
                passwordEncoder.encode("password"),
                false
        );
        userRepository.save(user);

        // Prépare la requête de connexion
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");

        // Effectue une requête POST vers /api/auth/login
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        // Vérifie que la réponse contient le token JWT
        String responseContent = result.getResponse().getContentAsString();
        assertThat(responseContent).contains("Bearer");
    }

    @Test
    void shouldFailAuthenticationWithInvalidCredentials() throws Exception {
        // Prépare une requête de connexion avec un mot de passe incorrect
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("wrongpassword");

        // Effectue une requête POST vers /api/auth/login
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
