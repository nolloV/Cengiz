package com.openclassrooms.starterjwt.services.integration;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;

@SpringBootTest
@Transactional
public class TeacherServiceIntegrationTest {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private TeacherRepository teacherRepository;

    private Teacher teacher1;
    private Teacher teacher2;

    @BeforeEach
    void setUp() {
        // Supprimez tous les enseignants avant chaque test pour garantir une base de données propre
        teacherRepository.deleteAll();

        // Créez des enseignants pour les tests
        teacher1 = new Teacher();
        teacher1.setFirstName("John");
        teacher1.setLastName("Doe");

        teacher2 = new Teacher();
        teacher2.setFirstName("Jane");
        teacher2.setLastName("Smith");

        // Sauvegardez-les dans la base de données
        teacherRepository.save(teacher1);
        teacherRepository.save(teacher2);
    }

    @Test
    void shouldFindAllTeachers() {
        // Test de la méthode findAll()
        List<Teacher> teachers = teacherService.findAll();
        assertNotNull(teachers, "La liste des enseignants ne doit pas être nulle");
        assertEquals(2, teachers.size(), "Il doit y avoir deux enseignants dans la base de données");
    }

    @Test
    void shouldFindTeacherById() {
        // Test de la méthode findById()
        Teacher foundTeacher = teacherService.findById(teacher1.getId());
        assertNotNull(foundTeacher, "L'enseignant doit être trouvé");
        assertEquals("John", foundTeacher.getFirstName(), "Le prénom doit correspondre");
        assertEquals("Doe", foundTeacher.getLastName(), "Le nom doit correspondre");
    }

    @Test
    void shouldReturnNullWhenTeacherNotFound() {
        // Test de la méthode findById() avec un ID inexistant
        Teacher teacher = teacherService.findById(999L);  // Utilisez un ID inexistant
        assertNull(teacher, "L'enseignant ne doit pas être trouvé");
    }
}
