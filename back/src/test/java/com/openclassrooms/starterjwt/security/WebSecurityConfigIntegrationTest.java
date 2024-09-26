package com.openclassrooms.starterjwt.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.models.User;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class WebSecurityConfigIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtils jwtUtils; // Injection de JwtUtils

    @Autowired
    private UserRepository userRepository; // Injection du UserRepository

    @Autowired
    private PasswordEncoder passwordEncoder; // Injection du PasswordEncoder pour encoder les mots de passe

    @Test
    void shouldAllowAccessToPublicRoutes() throws Exception {
        // Test accès à la route publique /api/auth/register sans authentification
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"email\": \"valid@example.com\", \"password\": \"validPassword\", \"firstName\": \"John\", \"lastName\": \"Doe\" }"))
                .andExpect(status().isOk()) // 200 OK attendu si la requête est correcte
                .andReturn();

        String responseContent = result.getResponse().getContentAsString();
        assertThat(responseContent).contains("User registered successfully");
    }

    @Test
    void shouldDenyAccessToProtectedRoutesWithoutAuthentication() throws Exception {
        // Test accès à une route protégée /api/user/me sans authentification
        mockMvc.perform(get("/api/user/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldGenerateAndValidateJwtToken() throws Exception {
        // Créez un utilisateur fictif
        User user = new User();
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword(passwordEncoder.encode("password123"));
        userRepository.save(user);
        System.out.println("User created with ID: " + user.getId() + " and Email: " + user.getEmail());

        // Créez un UserDetailsImpl basé sur cet utilisateur
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(user.getId())
                .username(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .password(user.getPassword())
                .build();

        // Créez une authentification basée sur cet utilisateur
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        // Génère un JWT valide
        String jwtToken = jwtUtils.generateJwtToken(authentication);
        System.out.println("Generated JWT: " + jwtToken);

        // Validez le JWT
        boolean isTokenValid = jwtUtils.validateJwtToken(jwtToken);
        assertTrue(isTokenValid, "The generated JWT should be valid");

        // Vérifiez que le nom d'utilisateur extrait du JWT correspond à celui de l'utilisateur
        String extractedUsername = jwtUtils.getUserNameFromJwtToken(jwtToken);
        assertEquals(user.getEmail(), extractedUsername, "The extracted username should match the user's email");
    }

}
