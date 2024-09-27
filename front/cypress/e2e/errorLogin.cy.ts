/// <reference types="cypress" />
describe('Login spec', () => {
    it('Login failed with incorrect credentials', () => {
        // Visiter la page de connexion
        cy.visit('/login')

        // Intercepter la requête de login pour simuler une erreur d'authentification
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 401, // Code d'état 401 pour une authentification échouée
            body: {
                message: 'Invalid email or password' // Message d'erreur à renvoyer
            },
        }).as('loginRequest')

        // Effectuer le login avec des informations incorrectes
        cy.get('input[formControlName=email]').type("wrong@studio.com") // Saisir un email incorrect
        cy.get('input[formControlName=password]').type("wrongpassword{enter}{enter}") // Saisir un mot de passe incorrect

        // Attendre que la requête de login soit terminée
        cy.wait('@loginRequest')

        // Vérifier que l'URL n'a pas changé, indiquant que l'utilisateur est toujours sur la page de connexion
        cy.url().should('include', '/login')

        // Vérifier que le message d'erreur s'affiche pour informer l'utilisateur de l'échec de la connexion
        cy.get('p.error').should('contain', 'An error occurred') // Vérifier que le message d'erreur est affiché
    })
});
