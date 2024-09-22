/// <reference types="cypress" />
describe('Register spec', () => {
    it('User registration failed with error message', () => {
        cy.visit('/register')

        // Intercepter la requête de registre pour simuler une erreur
        cy.intercept('POST', '/api/auth/register', {
            statusCode: 400,
            body: {
                message: 'Registration failed due to server error'
            },
        }).as('registerRequest')

        // Remplir le formulaire d'inscription avec des informations correctes
        cy.get('input[formControlName=firstName]').type("John")
        cy.get('input[formControlName=lastName]').type("Doe")
        cy.get('input[formControlName=email]').type("john.doe@example.com")
        cy.get('input[formControlName=password]').type("password123")

        // Soumettre le formulaire
        cy.get('button[type=submit]').click()

        // Attendre que la requête de registre soit terminée
        cy.wait('@registerRequest')

        // Vérifier que l'URL n'a pas changé
        cy.url().should('include', '/register')

        // Vérifier que le message d'erreur s'affiche
        cy.get('span.error').should('contain', 'An error occurred')
    })
});