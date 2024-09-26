package com.openclassrooms.starterjwt.services.integration;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UserServiceIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    private User savedUser;

    @BeforeEach
    void setUp() {
        // Nettoyage de la base de données avant chaque test
        userRepository.deleteAll();

        // Créez et sauvegardez un utilisateur avant chaque test
        User user = new User();
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password123");
        user.setAdmin(false);

        savedUser = userRepository.save(user);
    }

    @Test
    void shouldFindUserById() {
        // Test de la méthode findById()
        User foundUser = userService.findById(savedUser.getId());
        assertNotNull(foundUser, "L'utilisateur doit être trouvé");
        assertEquals("test@example.com", foundUser.getEmail(), "L'email doit correspondre");
        assertEquals("John", foundUser.getFirstName(), "Le prénom doit correspondre");
        assertEquals("Doe", foundUser.getLastName(), "Le nom de famille doit correspondre");
    }

    @Test
    void shouldDeleteUser() {
        // Test de la méthode delete()
        userService.delete(savedUser.getId());

        // Vérifiez que l'utilisateur a été supprimé
        User deletedUser = userService.findById(savedUser.getId());
        assertNull(deletedUser, "L'utilisateur ne doit plus exister après suppression");
    }
}
