/// <reference types="cypress" />
describe('Register spec', () => {
    it('User registration successful', () => {
        cy.visit('/register')

        // Intercepter la requête de registre pour inclure les informations utilisateur
        cy.intercept('POST', '/api/auth/register', {
            statusCode: 201,
            body: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                token: 'fake-jwt-token'
            },
        }).as('registerRequest')

        // Remplir le formulaire d'inscription
        cy.get('input[formControlName=firstName]').type("John")
        cy.get('input[formControlName=lastName]').type("Doe")
        cy.get('input[formControlName=email]').type("john.doe@example.com")
        cy.get('input[formControlName=password]').type("password123")

        // Soumettre le formulaire
        cy.get('button[type=submit]').click()

        // Attendre que la requête de registre soit terminée
        cy.wait('@registerRequest')

        // Vérifier que l'utilisateur est redirigé vers la page de login après l'inscription
        cy.url().should('include', '/login')

        // Intercepter la requête de login pour inclure les informations utilisateur
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                token: 'fake-jwt-token'
            },
        }).as('loginRequest')

        // Intercepter la requête de session pour simuler la récupération des sessions après le login
        cy.intercept('GET', '/api/session', {
            statusCode: 200,
            body: []
        }).as('sessionRequest')

        // Remplir le formulaire de login
        cy.get('input[formControlName=email]').type("john.doe@example.com")
        cy.get('input[formControlName=password]').type("password123")

        // Soumettre le formulaire de login
        cy.get('button[type=submit]').click()

        // Attendre que la requête de login soit terminée
        cy.wait('@loginRequest')

        // Attendre que la requête de session soit terminée
        cy.wait('@sessionRequest')

        // Vérifier que l'utilisateur est redirigé vers la page de sessions après le login
        cy.url().should('include', '/sessions')
    })
});