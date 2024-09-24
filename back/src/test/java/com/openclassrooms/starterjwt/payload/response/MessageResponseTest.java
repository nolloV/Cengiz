package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class MessageResponseTest {

    @Test
    public void testMessageResponseConstructorAndGetters() {
        // Données de test
        String message = "Test message";

        // Création de l'objet MessageResponse
        MessageResponse messageResponse = new MessageResponse(message);

        // Vérification des valeurs
        assertEquals(message, messageResponse.getMessage());
    }

    @Test
    public void testMessageResponseSetters() {
        // Création de l'objet MessageResponse
        MessageResponse messageResponse = new MessageResponse("Initial message");

        // Modification des valeurs
        messageResponse.setMessage("New message");

        // Vérification des nouvelles valeurs
        assertEquals("New message", messageResponse.getMessage());
    }
}
