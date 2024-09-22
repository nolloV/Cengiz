/// <reference types="cypress" />
describe('Login and Session List spec', () => {
    it('Login successful and display session list', () => {
        cy.visit('/login')

        // Intercepter la requête de login pour inclure le token avec les informations utilisateur
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: true,
                token: 'fake-jwt-token'
            },
        }).as('loginRequest')

        // Intercepter la requête pour obtenir les sessions
        cy.intercept('GET', '/api/session', {
            body: [
                {
                    id: 1,
                    name: 'Morning Yoga',
                    description: 'A relaxing morning yoga session.',
                    date: '2024-09-17T00:00:00.000Z',
                    teacher_id: 1,
                    users: [1, 2, 3],
                    createdAt: '2024-09-17T00:00:00.000Z',
                    updatedAt: '2024-09-17T00:00:00.000Z'
                },
                {
                    id: 2,
                    name: 'Evening Yoga',
                    description: 'An energizing evening yoga session.',
                    date: '2024-09-18T00:00:00.000Z',
                    teacher_id: 2,
                    users: [4, 5, 6],
                    createdAt: '2024-09-18T00:00:00.000Z',
                    updatedAt: '2024-09-18T00:00:00.000Z'
                }
            ]
        }).as('getSessions')

        // Effectuer le login
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type("test!1234{enter}{enter}")

        // Vérifier que l'URL inclut '/sessions'
        cy.url().should('include', '/sessions')

        // Attendre que la requête pour obtenir les sessions soit terminée
        cy.wait('@getSessions')

        // Vérifier que les sessions sont affichées
        cy.get('.list .items .item').should('have.length', 2)

        // Vérifier les détails de la première session
        cy.get('.list .items .item').eq(0).within(() => {
            cy.get('mat-card-title').should('contain', 'Morning Yoga')
            cy.get('mat-card-subtitle').should('contain', 'Session on September 16, 2024')
            cy.get('p').should('contain', 'A relaxing morning yoga session.')
        })

        // Vérifier les détails de la deuxième session
        cy.get('.list .items .item').eq(1).within(() => {
            cy.get('mat-card-title').should('contain', 'Evening Yoga')
            cy.get('mat-card-subtitle').should('contain', 'Session on September 17, 2024')
            cy.get('p').should('contain', 'An energizing evening yoga session.')
        })
    })
});