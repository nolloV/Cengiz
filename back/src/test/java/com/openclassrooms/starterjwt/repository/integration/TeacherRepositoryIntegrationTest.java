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

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@SpringBootTest
@Transactional
public class TeacherRepositoryIntegrationTest {

    @Autowired
    private TeacherRepository teacherRepository;

    @Test
    void shouldSaveAndFindTeacher() {
        // Créez un enseignant
        Teacher teacher = new Teacher();
        teacher.setFirstName("John");
        teacher.setLastName("Doe");

        // Sauvegardez l'enseignant
        teacher = teacherRepository.save(teacher);

        // Vérifiez que l'enseignant est bien sauvegardé
        assertNotNull(teacher.getId(), "L'enseignant doit avoir un ID après la sauvegarde");

        // Récupérez l'enseignant depuis la base de données
        Optional<Teacher> foundTeacher = teacherRepository.findById(teacher.getId());
        assertTrue(foundTeacher.isPresent(), "L'enseignant doit être trouvé en base de données");
        assertEquals("John", foundTeacher.get().getFirstName(), "Le prénom de l'enseignant doit correspondre");
        assertEquals("Doe", foundTeacher.get().getLastName(), "Le nom de famille de l'enseignant doit correspondre");
    }

    @Test
    void shouldDeleteTeacher() {
        // Créez un enseignant
        Teacher teacher = new Teacher();
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        // Sauvegardez l'enseignant
        teacher = teacherRepository.save(teacher);

        // Vérifiez que l'enseignant est bien sauvegardé
        assertNotNull(teacher.getId(), "L'enseignant doit avoir un ID après la sauvegarde");

        // Supprimez l'enseignant
        teacherRepository.deleteById(teacher.getId());

        // Vérifiez que l'enseignant n'existe plus
        Optional<Teacher> deletedTeacher = teacherRepository.findById(teacher.getId());
        assertFalse(deletedTeacher.isPresent(), "L'enseignant ne doit plus exister après la suppression");
    }
}
