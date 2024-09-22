/// <reference types="cypress" />
describe('Login and Session List and Detail spec', () => {
    it('Login successful, display session list, navigate to session detail, and delete session', () => {
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
                    date: '2024-09-17T00:06:56',
                    teacher_id: 1,
                    users: [1, 2, 3],
                    createdAt: '2024-09-17T00:06:56',
                    updatedAt: '2024-09-17T00:06:56'
                },
                {
                    id: 2,
                    name: 'Evening Yoga',
                    description: 'An energizing evening yoga session.',
                    date: '2024-09-18T00:06:56',
                    teacher_id: 2,
                    users: [4, 5, 6],
                    createdAt: '2024-09-18T00:06:56',
                    updatedAt: '2024-09-18T00:06:56'
                }
            ]
        }).as('getSessions')

        // Intercepter la requête pour obtenir les détails de la session
        cy.intercept('GET', '/api/session/1', {
            body: {
                id: 1,
                name: 'Morning Yoga',
                description: 'A relaxing morning yoga session.',
                date: '2024-09-17T00:06:56',
                teacher_id: 1,
                users: [1, 2, 3],
                createdAt: '2024-09-17T00:06:56',
                updatedAt: '2024-09-17T00:06:56'
            }
        }).as('getSessionDetail')

        // Intercepter la requête pour obtenir les détails du professeur
        cy.intercept('GET', '/api/teacher/1', {
            body: {
                id: 1,
                firstName: 'Jane',
                lastName: 'Doe',
                createdAt: '2024-01-02T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z'
            }
        }).as('getTeacherDetail')

        // Intercepter la requête de suppression de la session
        cy.intercept('DELETE', '/api/session/1', {
            statusCode: 200,
            body: {}
        }).as('deleteSession')

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
            cy.get('mat-card-subtitle').should('contain', 'Session on September 17, 2024')
            cy.get('p').should('contain', 'A relaxing morning yoga session.')
        })

        // Cliquer sur le bouton "Detail" de la première session
        cy.get('.list .items .item').eq(0).within(() => {
            cy.get('button').contains('Detail').click()
        })

        // Vérifier que l'URL inclut '/detail/1'
        cy.url().should('include', '/detail/1')

        // Attendre que la requête pour obtenir les détails de la session soit terminée
        cy.wait('@getSessionDetail')

        // Attendre que la requête pour obtenir les détails du professeur soit terminée
        cy.wait('@getTeacherDetail')

        // Vérifier les détails de la session sur la page de détail
        cy.get('h1').should('contain', 'Morning Yoga')
        cy.get('mat-card-subtitle').should('contain', 'Jane DOE')
        cy.get('.description').should('contain', 'A relaxing morning yoga session.')

        // Intercepter la requête pour obtenir les sessions après la suppression avant de cliquer sur le bouton "Delete"
        cy.intercept('GET', '/api/session', {
            body: [
                {
                    id: 2,
                    name: 'Evening Yoga',
                    description: 'An energizing evening yoga session.',
                    date: '2024-09-18T00:06:56',
                    teacher_id: 2,
                    users: [4, 5, 6],
                    createdAt: '2024-09-18T00:06:56',
                    updatedAt: '2024-09-18T00:06:56'
                }
            ]
        }).as('getSessionsAfterDelete')

        // Cliquer sur le bouton "Delete"
        cy.get('button').contains('Delete').click()

        // Attendre que la requête de suppression soit terminée
        cy.wait('@deleteSession')

        // Vérifier que l'utilisateur est redirigé vers la page des sessions
        cy.url().should('include', '/sessions')

        // Attendre que la requête pour obtenir les sessions après la suppression soit terminée
        cy.wait('@getSessionsAfterDelete')

        // Vérifier que la session a été supprimée
        cy.get('.list .items .item').should('have.length', 1)
    })
});