package com.openclassrooms.starterjwt.repository.integration;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@SpringBootTest
@Transactional
public class SessionRepositoryIntegrationTest {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TeacherRepository teacherRepository;  // Utiliser directement TeacherRepository

    @Test
    void shouldSaveAndFindSession() {
        // Créez un enseignant fictif pour la session
        Teacher teacher = new Teacher();
        teacher.setFirstName("Jane");
        teacher.setLastName("Doe");
        teacher = teacherRepository.save(teacher);  // Sauvegardez l'enseignant

        // Créez une session
        Session session = new Session();
        session.setName("Yoga Session");
        session.setDescription("A relaxing yoga session.");
        session.setDate(new Date());  // Utilisez une date actuelle
        session.setTeacher(teacher);  // Associez l'enseignant à la session
        session = sessionRepository.save(session);  // Sauvegardez la session

        // Vérifiez que la session est sauvegardée
        assertNotNull(session.getId(), "La session doit avoir un ID après sauvegarde");

        // Récupérez la session depuis la base de données
        Optional<Session> foundSession = sessionRepository.findById(session.getId());
        assertTrue(foundSession.isPresent(), "La session doit être trouvée en base de données");
        assertEquals("Yoga Session", foundSession.get().getName(), "Le nom de la session doit correspondre");
        assertEquals("Jane", foundSession.get().getTeacher().getFirstName(), "Le prénom de l'enseignant doit correspondre");
    }

    @Test
    void shouldDeleteSession() {
        // Créez une session fictive
        Session session = new Session();
        session.setName("Meditation Session");
        session.setDescription("A calming meditation session.");
        session.setDate(new Date());
        session = sessionRepository.save(session);

        // Vérifiez que la session est créée
        assertNotNull(session.getId(), "La session doit avoir un ID après sauvegarde");

        // Supprimez la session
        sessionRepository.deleteById(session.getId());

        // Vérifiez que la session n'existe plus
        Optional<Session> deletedSession = sessionRepository.findById(session.getId());
        assertFalse(deletedSession.isPresent(), "La session ne doit plus exister après suppression");
    }
}
