describe('Login in Sauce Demo website', () => {
  
    beforeEach(() => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(Cypress.config('validUsername'), Cypress.config('validPassword'));
  
      // Verify user is redirected to the next page.
        cy.url()
            .should('include', '/inventory.html');
    });

    it('Logout from the main page', () => {
        cy.logout();
        cy.url().should('include', 'saucedemo.com/');
    });
});