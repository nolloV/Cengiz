/// <reference types="cypress" />
describe('Login and Session List spec', () => {
    it('Login successful and display session list', () => {
        // Visiter la page de login
        cy.visit('/login')

        // Intercepter la requête de login pour inclure le token avec les informations utilisateur
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: 'userName', // Nom d'utilisateur simulé
                firstName: 'firstName', // Prénom simulé
                lastName: 'lastName', // Nom de famille simulé
                admin: true, // Indiquer que l'utilisateur est administrateur
                token: 'fake-jwt-token' // Token simulé pour l'authentification
            },
        }).as('loginRequest')

        // Intercepter la requête pour obtenir les sessions
        cy.intercept('GET', '/api/session', {
            body: [
                {
                    id: 1,
                    name: 'Morning Yoga', // Nom de la première session
                    description: 'A relaxing morning yoga session.', // Description de la première session
                    date: '2024-09-17T00:00:00.000Z', // Date de la première session
                    teacher_id: 1, // ID de l'enseignant pour la première session
                    users: [1, 2, 3], // Utilisateurs inscrits à la première session
                    createdAt: '2024-09-17T00:00:00.000Z', // Date de création de la première session
                    updatedAt: '2024-09-17T00:00:00.000Z' // Date de mise à jour de la première session
                },
                {
                    id: 2,
                    name: 'Evening Yoga', // Nom de la deuxième session
                    description: 'An energizing evening yoga session.', // Description de la deuxième session
                    date: '2024-09-18T00:00:00.000Z', // Date de la deuxième session
                    teacher_id: 2, // ID de l'enseignant pour la deuxième session
                    users: [4, 5, 6], // Utilisateurs inscrits à la deuxième session
                    createdAt: '2024-09-18T00:00:00.000Z', // Date de création de la deuxième session
                    updatedAt: '2024-09-18T00:00:00.000Z' // Date de mise à jour de la deuxième session
                }
            ]
        }).as('getSessions')

        // Effectuer le login avec les identifiants
        cy.get('input[formControlName=email]').type("yoga@studio.com") // Saisir l'email
        cy.get('input[formControlName=password]').type("test!1234{enter}{enter}") // Saisir le mot de passe

        // Vérifier que l'URL inclut '/sessions' après la connexion
        cy.url().should('include', '/sessions')

        // Attendre que la requête pour obtenir les sessions soit terminée
        cy.wait('@getSessions')

        // Vérifier que les sessions sont affichées sur la page
        cy.get('.list .items .item').should('have.length', 2) // Vérifier qu'il y a deux sessions

        // Vérifier les détails de la première session
        cy.get('.list .items .item').eq(0).within(() => {
            cy.get('mat-card-title').should('contain', 'Morning Yoga') // Vérifier le titre de la première session
            cy.get('mat-card-subtitle').should('contain', 'Session on September 16, 2024') // Vérifier la date de la première session
            cy.get('p').should('contain', 'A relaxing morning yoga session.') // Vérifier la description de la première session
        })

        // Vérifier les détails de la deuxième session
        cy.get('.list .items .item').eq(1).within(() => {
            cy.get('mat-card-title').should('contain', 'Evening Yoga') // Vérifier le titre de la deuxième session
            cy.get('mat-card-subtitle').should('contain', 'Session on September 17, 2024') // Vérifier la date de la deuxième session
            cy.get('p').should('contain', 'An energizing evening yoga session.') // Vérifier la description de la deuxième session
        })
    })
});
