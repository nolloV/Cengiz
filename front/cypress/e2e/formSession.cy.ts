/// <reference types="cypress" />
describe('Login and Session List spec', () => {
    it('Login successful, display session list, and create a new session', () => {
        // Visiter la page de login
        cy.visit('/login')

        // Intercepter la requête de login pour inclure le token avec les informations utilisateur
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: true,
                token: 'fake-jwt-token' // Token simulé pour l'authentification
            },
        }).as('loginRequest')

        // Intercepter la requête pour obtenir les sessions initiales
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

        // Intercepter la requête pour obtenir les enseignants
        cy.intercept('GET', '/api/teacher', {
            body: [
                { id: 1, firstName: 'Jane', lastName: 'Doe' },
                { id: 2, firstName: 'John', lastName: 'Smith' }
            ]
        }).as('getTeachers')

        // Intercepter la requête pour créer une nouvelle session
        cy.intercept('POST', '/api/session', {
            statusCode: 201,
            body: {
                id: 3,
                name: 'Afternoon Yoga',
                description: 'A calming afternoon yoga session.',
                date: '2024-09-19T00:00:00.000Z',
                teacher_id: 1,
                users: [],
                createdAt: '2024-09-19T00:00:00.000Z',
                updatedAt: '2024-09-19T00:00:00.000Z'
            }
        }).as('createSession')

        // Effectuer le login
        cy.get('input[formControlName=email]').type("yoga@studio.com") // Saisir l'email
        cy.get('input[formControlName=password]').type("test!1234{enter}{enter}") // Saisir le mot de passe

        // Vérifier que l'URL inclut '/sessions' après la connexion
        cy.url().should('include', '/sessions')

        // Attendre que la requête pour obtenir les sessions soit terminée
        cy.wait('@getSessions')

        // Vérifier que les sessions sont affichées sur la page
        cy.get('.list .items .item').should('have.length', 2)

        // Cliquer sur le bouton "Create" pour créer une nouvelle session
        cy.get('button').contains('Create').click()

        // Attendre que la requête pour obtenir les enseignants soit terminée
        cy.wait('@getTeachers')

        // Remplir le formulaire de création de session
        cy.get('input[formControlName=name]').type('Afternoon Yoga') // Nom de la session
        cy.get('input[formControlName=date]').type('2024-09-19') // Date de la session
        cy.get('mat-select[formControlName=teacher_id]').click().get('mat-option').contains('Jane Doe').click() // Sélectionner l'enseignant
        cy.get('textarea[formControlName=description]').type('A calming afternoon yoga session.') // Description de la session

        // Intercepter la requête pour obtenir les sessions après la création de la nouvelle session
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
                },
                {
                    id: 3,
                    name: 'Afternoon Yoga',
                    description: 'A calming afternoon yoga session.',
                    date: '2024-09-19T00:00:00.000Z',
                    teacher_id: 1,
                    users: [],
                    createdAt: '2024-09-19T00:00:00.000Z',
                    updatedAt: '2024-09-19T00:00:00.000Z'
                }
            ]
        }).as('getSessionsAfterCreate')

        // Soumettre le formulaire de création de session
        cy.get('button[type=submit]').click()

        // Attendre que la requête pour créer la session soit terminée
        cy.wait('@createSession')

        // Attendre que la requête pour obtenir les sessions après la création soit terminée
        cy.wait('@getSessionsAfterCreate')

        // Vérifier que l'utilisateur est redirigé vers la page des sessions
        cy.url().should('include', '/sessions')

        // Vérifier que la nouvelle session est affichée dans la liste des sessions
        cy.get('.list .items .item').should('have.length', 3) // Vérifier le nombre total de sessions
        cy.get('.list .items .item').eq(2).within(() => {
            cy.get('mat-card-title').should('contain', 'Afternoon Yoga') // Vérifier le nom de la nouvelle session
            cy.get('mat-card-subtitle').should('contain', 'Session on September 18, 2024') // Vérifier la date
            cy.get('p').should('contain', 'A calming afternoon yoga session.') // Vérifier la description
        })
    })
});
