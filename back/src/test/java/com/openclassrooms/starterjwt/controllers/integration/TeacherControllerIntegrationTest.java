package com.openclassrooms.starterjwt.controllers.integration;

import java.time.LocalDateTime;

import javax.transaction.Transactional;

import static org.hamcrest.Matchers.is;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class TeacherControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherRepository teacherRepository;

    private Teacher testTeacher;

    @BeforeEach
    public void setUp() {
        // Créer un enseignant de test
        testTeacher = Teacher.builder()
                .firstName("Margot")
                .lastName("DELAHAYE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        teacherRepository.save(testTeacher);
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testFindById_Success() throws Exception {
        mockMvc.perform(get("/api/teacher/" + testTeacher.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Margot")))
                .andExpect(jsonPath("$.lastName", is("DELAHAYE")));
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testFindAll_Success() throws Exception {
        mockMvc.perform(get("/api/teacher")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName", is("Margot")))
                .andExpect(jsonPath("$[0].lastName", is("DELAHAYE")));
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testFindById_NotFound() throws Exception {
        mockMvc.perform(get("/api/teacher/99999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    public void testFindById_BadRequest() throws Exception {
        mockMvc.perform(get("/api/teacher/invalid-id")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
