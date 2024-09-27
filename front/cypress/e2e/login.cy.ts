/// <reference types="cypress" />
describe('Login spec', () => {
  it('Login successfull', () => {
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
    })

    // Intercepter la requête pour obtenir la liste des sessions, ici elle renvoie une liste vide
    cy.intercept(
      {
        method: 'GET', // Méthode GET
        url: '/api/session', // URL de la requête
      },
      []).as('session') // Attribuer un alias à cette interception

    // Saisir l'email dans le champ de connexion
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    // Saisir le mot de passe et simuler l'envoi du formulaire
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    // Vérifier que l'URL inclut '/sessions' après la connexion réussie
    cy.url().should('include', '/sessions')
  })
});
