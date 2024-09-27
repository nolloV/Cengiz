/// <reference types="cypress" />
describe('Page not found spec', () => {
    it('should display "Page not found !" message for non-existent page', () => {
        // Visiter une page inexistante sans échouer sur le code de statut
        cy.visit('/non-existent-page', { failOnStatusCode: false })

        // Vérifier que le message "Page not found !" s'affiche dans l'élément spécifié
        cy.get('div.flex.justify-center.mt3 h1').should('contain', 'Page not found !')
    })
});
