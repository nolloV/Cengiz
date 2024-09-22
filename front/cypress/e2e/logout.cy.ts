/// <reference types="cypress" />
describe('Login and Logout spec', () => {
    it('Login successful and logout', () => {
        cy.visit('/login')

        // Intercepter la requête de login pour inclure le token avec les informations utilisateur
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: true
            },
        }).as('loginRequest')

        // Intercepter la requête de session (si nécessaire)
        cy.intercept('GET', '/api/session', []).as('session')

        // Effectuer le login
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type("test!1234{enter}{enter}")

        // Vérifier que l'URL inclut '/sessions'
        cy.url().should('include', '/sessions')

        // Cliquer sur le bouton "Logout"
        cy.get('span.link').contains('Logout').click()

        // Vérifier que l'utilisateur est redirigé vers la page d'accueil après la déconnexion
        cy.url().should('eq', Cypress.config().baseUrl)
    })
});