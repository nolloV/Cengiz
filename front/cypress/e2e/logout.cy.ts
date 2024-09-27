/// <reference types="cypress" />
describe('Login and Logout spec', () => {
    it('Login successful and logout', () => {
        // Visiter la page de login
        cy.visit('/login')

        // Intercepter la requête de login pour simuler une réponse réussie avec des informations utilisateur
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1, // ID de l'utilisateur
                username: 'userName', // Nom d'utilisateur simulé
                firstName: 'firstName', // Prénom simulé
                lastName: 'lastName', // Nom de famille simulé
                admin: true // Indiquer que l'utilisateur est administrateur
            },
        }).as('loginRequest') // Attribuer un alias à la requête de login

        // Intercepter la requête pour obtenir la liste des sessions, ici elle renvoie une liste vide
        cy.intercept('GET', '/api/session', []).as('session') // Attribuer un alias à cette interception

        // Saisir l'email dans le champ de connexion
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        // Saisir le mot de passe et simuler l'envoi du formulaire
        cy.get('input[formControlName=password]').type("test!1234{enter}{enter}")

        // Vérifier que l'URL inclut '/sessions' après une connexion réussie
        cy.url().should('include', '/sessions')

        // Cliquer sur le bouton "Logout" pour se déconnecter
        cy.get('span.link').contains('Logout').click()

        // Vérifier que l'utilisateur est redirigé vers la page d'accueil après la déconnexion
        cy.url().should('include', '/')
    })
});
