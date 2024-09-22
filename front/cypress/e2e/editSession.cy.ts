/// <reference types="cypress" />
describe('Login and Session List spec', () => {
    it('Login successful, display session list, click Edit button, and update session', () => {
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

        // Intercepter la requête pour obtenir les détails de la session
        cy.intercept('GET', '/api/session/2', {
            body: {
                id: 2,
                name: 'Evening Yoga',
                description: 'An energizing evening yoga session.',
                date: '2024-09-18T00:00:00.000Z',
                teacher_id: 2,
                users: [4, 5, 6],
                createdAt: '2024-09-18T00:00:00.000Z',
                updatedAt: '2024-09-18T00:00:00.000Z'
            }
        }).as('getSessionDetail')

        // Intercepter la requête pour obtenir les enseignants
        cy.intercept('GET', '/api/teacher', {
            body: [
                { id: 1, firstName: 'Jane', lastName: 'Doe' },
                { id: 2, firstName: 'John', lastName: 'Smith' }
            ]
        }).as('getTeachers')

        // Intercepter la requête pour mettre à jour la session
        cy.intercept('PUT', '/api/session/2', {
            statusCode: 200,
            body: {
                id: 2,
                name: 'Updated Evening Yoga',
                description: 'An updated energizing evening yoga session.',
                date: '2024-09-19T00:00:00.000Z',
                teacher_id: 1,
                users: [4, 5, 6],
                createdAt: '2024-09-18T00:00:00.000Z',
                updatedAt: '2024-09-19T00:00:00.000Z'
            }
        }).as('updateSession')

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
            cy.get('p').should('contain', 'A relaxing morning yoga session.')
        })

        // Vérifier les détails de la deuxième session
        cy.get('.list .items .item').eq(1).within(() => {
            cy.get('mat-card-title').should('contain', 'Evening Yoga')
            cy.get('p').should('contain', 'An energizing evening yoga session.')
        })

        // Cliquer sur le bouton "Edit" de la deuxième session
        cy.get('.list .items .item').eq(1).within(() => {
            cy.get('button[mat-raised-button][color="primary"]').contains('Edit').click()
        })

        // Vérifier que l'URL inclut '/update/2'
        cy.url().should('include', '/update/2')

        // Attendre que la requête pour obtenir les détails de la session soit terminée
        cy.wait('@getSessionDetail')

        // Attendre que la requête pour obtenir les enseignants soit terminée
        cy.wait('@getTeachers')

        // Mettre à jour le formulaire de session
        cy.get('input[formControlName=name]').clear().type('Updated Evening Yoga')
        cy.get('input[formControlName=date]').clear().type('2024-09-19')
        cy.get('mat-select[formControlName=teacher_id]').click().get('mat-option').contains('Jane Doe').click()
        cy.get('textarea[formControlName=description]').clear().type('An updated energizing evening yoga session.')

        // Intercepter la requête pour obtenir les sessions après la mise à jour
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
                    name: 'Updated Evening Yoga',
                    description: 'An updated energizing evening yoga session.',
                    date: '2024-09-19T00:00:00.000Z',
                    teacher_id: 1,
                    users: [4, 5, 6],
                    createdAt: '2024-09-18T00:00:00.000Z',
                    updatedAt: '2024-09-19T00:00:00.000Z'
                }
            ]
        }).as('getSessionsAfterUpdate')

        // Soumettre le formulaire
        cy.get('button[type=submit]').click()

        // Attendre que la requête pour mettre à jour la session soit terminée
        cy.wait('@updateSession')

        // Attendre que la requête pour obtenir les sessions après la mise à jour soit terminée
        cy.wait('@getSessionsAfterUpdate')

        // Vérifier que l'utilisateur est redirigé vers la page des sessions
        cy.url().should('include', '/sessions')

        // Vérifier que la session mise à jour est affichée dans la liste des sessions
        cy.get('.list .items .item').should('have.length', 2)
        cy.get('.list .items .item').eq(1).within(() => {
            cy.get('mat-card-title').should('contain', 'Updated Evening Yoga')
            cy.get('p').should('contain', 'An updated energizing evening yoga session.')
        })
    })
});