/// <reference types="cypress" />

describe('Login in Sauce Demo website', () => {
  
    beforeEach(() => {
      cy.visit(Cypress.config("baseUrl"));
    });
  
    it('1.1 Verify login with an Invalid User - locked_out_user', () => {
        cy.login(Cypress.config('lockedUser'), Cypress.config('validPassword'));
        cy.verifyErrorMessage('Sorry, this user has been locked out.');
    });
  
    it('1.2 Verify login with a Valid User - standard_user', () => {
        cy.login(Cypress.config('validUsername'), Cypress.config('validPassword'));
  
      // Verify user is redirected to the next page.
        cy.url()
            .should('include', '/inventory.html');
    });
  
    // 1.3 Negative Cases
    it('1.3 a) Verify login with a Valid User and Invalid Password', () => {
      cy.login(Cypress.config('validUsername'), Cypress.config('invalidPassword'));
      cy.verifyErrorMessage('Username and password do not match any user in this service');
    });
  
    it('1.3 b) Verify login with Invalid User and Valid Password', () => {
      cy.login(Cypress.config('invalidUsername'), Cypress.config('validPassword'));
      cy.verifyErrorMessage('Username and password do not match any user in this service');
    });

    // Empty fields scenarios
    it('1.3 c) - Verify empty logging in with password', () => {
      cy.get('#user-name').type(Cypress.config('validUsername'));
      cy.get('#login-button').click();
      cy.verifyErrorMessage('Password is required');
    });
  
    it('1.3 d) - Verify empty logging in with empty username', () => {
      cy.get('#password').type(Cypress.config('validPassword'));
      cy.get('#login-button').click();
      cy.verifyErrorMessage('Username is required');
    });
  
    it('1.3 e) - Verify empty logging in with empty username and password', () => {
      cy.get('#login-button').click();
      cy.verifyErrorMessage('Username is required');
    });
  });
  