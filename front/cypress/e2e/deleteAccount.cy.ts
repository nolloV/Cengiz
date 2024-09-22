/// <reference types="cypress" />
describe('Login spec', () => {
    it('Login successful, navigate to account, and delete account', () => {
        cy.visit('/login')

        // Intercepter la requête de login pour inclure le token avec les informations utilisateur
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 2,
                username: 'userName',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@studio.com',
                admin: false,
                createdAt: '2024-09-17T00:06:56',
                updatedAt: '2024-09-17T00:06:56',
                token: 'fake-jwt-token' // Ajout d'un token factice pour la simulation
            },
        }).as('loginRequest')

        // Intercepter la requête de session (si nécessaire)
        cy.intercept('GET', '/api/session', []).as('session')

        // Effectuer le login
        cy.get('input[formControlName=email]').type("john.doe@studio.com")
        cy.get('input[formControlName=password]').type("test!1234{enter}{enter}")

        // Vérifier que l'URL inclut '/sessions'
        cy.url().should('include', '/sessions')

        // Intercepter la requête pour obtenir les informations utilisateur par ID
        cy.intercept('GET', '/api/user/2', {
            body: {
                id: 2,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@studio.com',
                admin: false,
                createdAt: '2024-09-17T00:06:56',
                updatedAt: '2024-09-17T00:06:56'
            },
        }).as('getUser')

        // Cliquer sur le bouton "Account"
        cy.get('span[routerlink="me"]').click()

        // Vérifier que l'URL inclut '/me'
        cy.url().should('include', '/me')

        // Attendre que la requête pour obtenir les informations utilisateur soit terminée
        cy.wait('@getUser')

        // Vérifier que les informations utilisateur sont affichées
        cy.get('p').contains('Name: John DOE')
        cy.get('p').contains('Email: john.doe@studio.com')
        cy.get('p').contains('Create at: September 17, 2024')
        cy.get('p').contains('Last update: September 17, 2024')

        // Intercepter la requête de suppression de compte
        cy.intercept('DELETE', '/api/user/2', {
            statusCode: 200,
            body: {}
        }).as('deleteUser')

        // Cliquer sur le bouton "Delete my account"
        cy.get('button[color="warn"]').click()

        // Attendre que la requête de suppression de compte soit terminée
        cy.wait('@deleteUser')

        // Vérifier que l'utilisateur est redirigé vers la page d'accueil
        cy.url().should('include', '/')
    })
});