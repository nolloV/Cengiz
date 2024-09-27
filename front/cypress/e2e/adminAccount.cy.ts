/// <reference types="cypress" />
describe('Login spec', () => {
    it('Login successful and navigate to account', () => {
        // Visiter la page de connexion
        cy.visit('/login')

        // Intercepter la requête de login pour inclure le token avec les informations utilisateur
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'Admin',
                lastName: 'Admin',
                email: 'yoga@studio.com',
                admin: true,
                createdAt: '2024-09-17T00:06:56',
                updatedAt: '2024-09-17T00:06:56',
                token: 'fake-jwt-token' // Ajout d'un token factice pour la simulation
            },
        }).as('loginRequest')

        // Intercepter la requête de session (si nécessaire)
        cy.intercept('GET', '/api/session', []).as('session')

        // Remplir le formulaire de connexion avec l'email et le mot de passe
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type("test!1234{enter}{enter}")

        // Vérifier que l'utilisateur est redirigé vers la page des sessions
        cy.url().should('include', '/sessions')

        // Intercepter la requête pour obtenir les informations utilisateur par ID
        cy.intercept('GET', '/api/user/1', {
            body: {
                id: 1,
                firstName: 'Admin',
                lastName: 'Admin',
                email: 'yoga@studio.com',
                admin: true,
                createdAt: '2024-09-17T00:06:56',
                updatedAt: '2024-09-17T00:06:56'
            },
        }).as('getUser')

        // Cliquer sur le bouton "Account" pour accéder aux informations du compte
        cy.get('span[routerlink="me"]').click()

        // Vérifier que l'URL inclut '/me' après la navigation
        cy.url().should('include', '/me')

        // Attendre que la requête pour obtenir les informations utilisateur soit terminée
        cy.wait('@getUser')

        // Vérifier que les informations utilisateur sont correctement affichées
        cy.get('p').contains('Name: Admin ADMIN')
        cy.get('p').contains('Email: yoga@studio.com')
        cy.get('p').contains('You are admin')
        cy.get('p').contains('Create at: September 17, 2024')
        cy.get('p').contains('Last update: September 17, 2024')
    })
});
