/// <reference types="cypress" />
describe('Login spec', () => {
    it('Login failed with incorrect credentials', () => {
        cy.visit('/login')

        // Intercepter la requête de login pour simuler une erreur d'authentification
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 401,
            body: {
                message: 'Invalid email or password'
            },
        }).as('loginRequest')

        // Effectuer le login avec des informations incorrectes
        cy.get('input[formControlName=email]').type("wrong@studio.com")
        cy.get('input[formControlName=password]').type("wrongpassword{enter}{enter}")

        // Attendre que la requête de login soit terminée
        cy.wait('@loginRequest')

        // Vérifier que l'URL n'a pas changé
        cy.url().should('include', '/login')

        // Vérifier que le message d'erreur s'affiche
        cy.get('p.error').should('contain', 'An error occurred')
    })
});