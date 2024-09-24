package com.openclassrooms.starterjwt.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class WebSecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testPublicLoginEndpoint() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content("{\"email\":\"test@example.com\", \"password\":\"password\"}"))
                .andExpect(status().isOk());
    }

    // @Test
    // public void testPublicRegisterEndpoint() throws Exception {
    //     mockMvc.perform(post("/api/auth/register")
    //             .contentType("application/json")
    //             .content("{\"email\":\"test@example.com\", \"password\":\"password\", \"firstName\":\"John\", \"lastName\":\"Doe\"}"))
    //             .andExpect(status().isOk());
    // }
    @Test
    @WithMockUser
    public void testAuthenticatedSessionEndpoint() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void testAuthenticatedUserEndpoint() throws Exception {
        mockMvc.perform(get("/api/user/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testAuthenticatedUserEndpointWithoutUser() throws Exception {
        mockMvc.perform(get("/api/user/1"))
                .andExpect(status().isUnauthorized());
    }
}
