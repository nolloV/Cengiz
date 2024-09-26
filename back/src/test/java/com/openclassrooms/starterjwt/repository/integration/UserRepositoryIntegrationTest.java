package com.openclassrooms.starterjwt.repository.integration;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest
@Transactional
public class UserRepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveAndFindUserById() {
        // Créez un utilisateur
        User user = new User();
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password123");
        user.setAdmin(false);

        // Sauvegardez l'utilisateur
        user = userRepository.save(user);

        // Vérifiez que l'utilisateur est bien sauvegardé
        assertNotNull(user.getId(), "L'utilisateur doit avoir un ID après la sauvegarde");

        // Récupérez l'utilisateur depuis la base de données
        Optional<User> foundUser = userRepository.findById(user.getId());
        assertTrue(foundUser.isPresent(), "L'utilisateur doit être trouvé en base de données");
        assertEquals("test@example.com", foundUser.get().getEmail(), "L'email doit correspondre");
    }

    @Test
    void shouldFindUserByEmail() {
        // Créez un utilisateur
        User user = new User();
        user.setEmail("findbyemail@example.com");
        user.setFirstName("Jane");
        user.setLastName("Smith");
        user.setPassword("password456");
        user.setAdmin(true);

        // Sauvegardez l'utilisateur
        userRepository.save(user);

        // Récupérez l'utilisateur par email
        Optional<User> foundUser = userRepository.findByEmail("findbyemail@example.com");
        assertTrue(foundUser.isPresent(), "L'utilisateur doit être trouvé par son email");
        assertEquals("Jane", foundUser.get().getFirstName(), "Le prénom doit correspondre");
    }

    @Test
    void shouldCheckIfUserExistsByEmail() {
        // Créez un utilisateur
        User user = new User();
        user.setEmail("exists@example.com");
        user.setFirstName("Mark");
        user.setLastName("Johnson");
        user.setPassword("password789");
        user.setAdmin(false);

        // Sauvegardez l'utilisateur
        userRepository.save(user);

        // Vérifiez si l'utilisateur existe par email
        assertTrue(userRepository.existsByEmail("exists@example.com"), "L'utilisateur doit exister avec cet email");
        assertFalse(userRepository.existsByEmail("doesnotexist@example.com"), "Cet email ne doit pas exister en base de données");
    }

    @Test
    void shouldDeleteUser() {
        // Créez un utilisateur
        User user = new User();
        user.setEmail("delete@example.com");
        user.setFirstName("David");
        user.setLastName("Brown");
        user.setPassword("password987");
        user.setAdmin(true);

        // Sauvegardez l'utilisateur
        user = userRepository.save(user);

        // Vérifiez que l'utilisateur est bien sauvegardé
        assertNotNull(user.getId(), "L'utilisateur doit avoir un ID après la sauvegarde");

        // Supprimez l'utilisateur
        userRepository.deleteById(user.getId());

        // Vérifiez que l'utilisateur n'existe plus
        Optional<User> deletedUser = userRepository.findById(user.getId());
        assertFalse(deletedUser.isPresent(), "L'utilisateur ne doit plus exister après suppression");
    }
}
