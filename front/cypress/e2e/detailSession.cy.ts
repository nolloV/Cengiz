/// <reference types="cypress" />
describe('Login and Session List and Detail spec', () => {
    it('Login successful, display session list, navigate to session detail, and delete session', () => {
        // Visiter la page de connexion
        cy.visit('/login')

        // Intercepter la requête de login pour inclure un token fictif
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

        // Intercepter la requête pour obtenir la liste des sessions
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

        // Intercepter la requête pour obtenir les détails de la première session
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

        // Intercepter la requête pour obtenir les détails du professeur associé à la session
        cy.intercept('GET', '/api/teacher/1', {
            body: {
                id: 1,
                firstName: 'Jane',
                lastName: 'Doe',
                createdAt: '2024-01-02T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z'
            }
        }).as('getTeacherDetail')

        // Intercepter la requête de suppression de la première session
        cy.intercept('DELETE', '/api/session/1', {
            statusCode: 200,
            body: {}
        }).as('deleteSession')

        // Remplir le formulaire de connexion avec les informations d'identification
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type("test!1234{enter}{enter}")

        // Vérifier que l'utilisateur est redirigé vers la page des sessions
        cy.url().should('include', '/sessions')

        // Attendre que la requête pour obtenir les sessions soit terminée
        cy.wait('@getSessions')

        // Vérifier que les sessions affichées correspondent à l'attendu
        cy.get('.list .items .item').should('have.length', 2)

        // Vérifier les détails de la première session dans la liste
        cy.get('.list .items .item').eq(0).within(() => {
            cy.get('mat-card-title').should('contain', 'Morning Yoga')
            cy.get('mat-card-subtitle').should('contain', 'Session on September 17, 2024')
            cy.get('p').should('contain', 'A relaxing morning yoga session.')
        })

        // Cliquer sur le bouton "Detail" de la première session pour naviguer vers les détails
        cy.get('.list .items .item').eq(0).within(() => {
            cy.get('button').contains('Detail').click()
        })

        // Vérifier que l'URL inclut '/detail/1' après la navigation
        cy.url().should('include', '/detail/1')

        // Attendre que les détails de la session soient chargés
        cy.wait('@getSessionDetail')

        // Attendre que les détails du professeur soient chargés
        cy.wait('@getTeacherDetail')

        // Vérifier que les détails de la session sont correctement affichés sur la page de détail
        cy.get('h1').should('contain', 'Morning Yoga')
        cy.get('mat-card-subtitle').should('contain', 'Jane DOE')
        cy.get('.description').should('contain', 'A relaxing morning yoga session.')

        // Intercepter la requête pour obtenir la liste des sessions après suppression
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

        // Cliquer sur le bouton "Delete" pour supprimer la session
        cy.get('button').contains('Delete').click()

        // Attendre que la requête de suppression soit terminée
        cy.wait('@deleteSession')

        // Vérifier que l'utilisateur est redirigé vers la page des sessions après suppression
        cy.url().should('include', '/sessions')

        // Attendre que la requête pour obtenir la liste des sessions après la suppression soit terminée
        cy.wait('@getSessionsAfterDelete')

        // Vérifier que la session a bien été supprimée de la liste
        cy.get('.list .items .item').should('have.length', 1)
    })
});
