package com.openclassrooms.starterjwt.services.integration;

import java.util.ArrayList;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;

@SpringBootTest
@Transactional
public class SessionServiceIntegrationTest {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveAndFindSession() {
        // Créez une session et sauvegardez-la
        Session session = new Session();
        session.setName("Yoga Session");
        session.setDescription("A relaxing yoga session.");
        session.setDate(new Date());

        Session savedSession = sessionRepository.save(session);  // Utilisation de sessionRepository pour sauvegarder la session
        assertNotNull(savedSession.getId(), "La session doit avoir un ID après la sauvegarde");

        // Récupérez la session depuis la base de données
        Session foundSession = sessionService.getById(savedSession.getId());
        assertNotNull(foundSession, "La session doit être trouvée en base de données");
        assertEquals("Yoga Session", foundSession.getName(), "Le nom de la session doit correspondre");
    }

    @Test
    void shouldDeleteSession() {
        // Créez et sauvegardez une session
        Session session = new Session();
        session.setName("Meditation Session");
        session.setDescription("A calming meditation session.");
        session.setDate(new Date());

        Session savedSession = sessionRepository.save(session);  // Utilisation de sessionRepository pour sauvegarder la session
        assertNotNull(savedSession.getId(), "La session doit avoir un ID après la sauvegarde");

        // Supprimez la session
        sessionService.delete(savedSession.getId());

        // Vérifiez que la session n'existe plus
        assertNull(sessionService.getById(savedSession.getId()), "La session ne doit plus exister après suppression");
    }

    @Test
    void shouldParticipateInSession() {
        // Créez et sauvegardez une session
        Session session = new Session();
        session.setName("Meditation Session");
        session.setDescription("A calming meditation session.");
        session.setDate(new Date());

        // Initialisez la liste des utilisateurs si elle est null (dans le test)
        if (session.getUsers() == null) {
            session.setUsers(new ArrayList<>());  // On initialise la liste dans le test
        }

        Session savedSession = sessionRepository.save(session);  // Utilisation de sessionRepository pour sauvegarder la session
        assertNotNull(savedSession.getId(), "La session doit avoir un ID après la sauvegarde");

        // Créez et sauvegardez un utilisateur
        User user = new User();
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("password123");
        user.setAdmin(false);

        // Utilisation de userRepository pour sauvegarder l'utilisateur
        User savedUser = userRepository.save(user);
        assertNotNull(savedUser.getId(), "L'utilisateur doit avoir un ID après la sauvegarde");

        // L'utilisateur participe à la session
        sessionService.participate(savedSession.getId(), savedUser.getId());

        // Vérifiez que l'utilisateur est bien ajouté à la session
        Session foundSession = sessionService.getById(savedSession.getId());
        assertNotNull(foundSession.getUsers(), "La liste des utilisateurs ne doit pas être nulle");
        assertTrue(foundSession.getUsers().stream().anyMatch(u -> u.getId().equals(savedUser.getId())), "L'utilisateur doit participer à la session");
    }

}
