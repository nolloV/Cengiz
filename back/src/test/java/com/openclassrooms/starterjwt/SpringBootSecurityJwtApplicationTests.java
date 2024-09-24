package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class SpringBootSecurityJwtApplicationTests {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    public void contextLoads() {
        // Vérifie que le contexte de l'application se charge correctement
        assertNotNull(applicationContext);
    }

    @Test
    public void testMain() {
        // Vérifie que l'application démarre sans erreurs
        SpringBootSecurityJwtApplication.main(new String[] {});
    }

    @Test
    public void testBeansInitialization() {
        // Vérifie que les beans principaux sont correctement initialisés
        assertNotNull(applicationContext.getBean(SpringBootSecurityJwtApplication.class));
        // Ajoutez d'autres beans que vous souhaitez vérifier
    }
}