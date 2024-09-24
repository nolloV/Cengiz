package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class JwtResponseTest {

    @Test
    public void testJwtResponseConstructorAndGetters() {
        // Données de test
        String token = "testToken";
        Long id = 1L;
        String username = "testUser";
        String firstName = "John";
        String lastName = "Doe";
        Boolean admin = true;

        // Création de l'objet JwtResponse
        JwtResponse jwtResponse = new JwtResponse(token, id, username, firstName, lastName, admin);

        // Vérification des valeurs
        assertEquals(token, jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertEquals(id, jwtResponse.getId());
        assertEquals(username, jwtResponse.getUsername());
        assertEquals(firstName, jwtResponse.getFirstName());
        assertEquals(lastName, jwtResponse.getLastName());
        assertEquals(admin, jwtResponse.getAdmin());
    }

    @Test
    public void testJwtResponseSetters() {
        // Création de l'objet JwtResponse
        JwtResponse jwtResponse = new JwtResponse("initialToken", 1L, "initialUser", "Initial", "User", false);

        // Modification des valeurs
        jwtResponse.setToken("newToken");
        jwtResponse.setId(2L);
        jwtResponse.setUsername("newUser");
        jwtResponse.setFirstName("Jane");
        jwtResponse.setLastName("Smith");
        jwtResponse.setAdmin(true);

        // Vérification des nouvelles valeurs
        assertEquals("newToken", jwtResponse.getToken());
        assertEquals(2L, jwtResponse.getId());
        assertEquals("newUser", jwtResponse.getUsername());
        assertEquals("Jane", jwtResponse.getFirstName());
        assertEquals("Smith", jwtResponse.getLastName());
        assertEquals(true, jwtResponse.getAdmin());
    }
}
