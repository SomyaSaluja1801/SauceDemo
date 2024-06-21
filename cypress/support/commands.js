// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.

Cypress.Commands.add('login', (username, password) => {
    cy.get('#user-name').type(username);
    cy.get('#password').type(password);
    cy.get('#login-button').click();
  });

Cypress.Commands.add('logout', () => {
    cy.get('#react-burger-menu-btn').click(); 
        cy.get('#logout_sidebar_link').click();
});
  
// Check message
Cypress.Commands.add('verifyErrorMessage', (message) => {
    cy.xpath('//h3[@data-test = "error"]').should('contain', message);
  });

// To sort the products
Cypress.Commands.add('selectSortOption', (option) => {
    cy.get('.product_sort_container').select(option);
    cy.get('.active_option').invoke('text')
        .should('contain', `${option}`);
});

// Count the number of prodcuts on the page.
Cypress.Commands.add('productsCount',() => {
    cy.get('.inventory_item_name').then(($element) => {
        const totalProducts = $element.length;
        cy.wrap(totalProducts);
    });
});

//Add products to cart.
Cypress.Commands.add("addProduct", (productId) => {
    cy.xpath(`//div[@class = "pricebar"]//button[@id = "${productId}"]`).click({force: true});
});

// Empty the cart
Cypress.Commands.add('emptyCart', () => {
    cy.get('.shopping_cart_link').click({force: true});
    cy.get('.cart_item').then($items => {
        if ($items.length > 0) {
            cy.wrap($items).each($item => {
                cy.wrap($item).find('.cart_button').click();
            });
        }
    });
    cy.get('[data-test="continue-shopping"]').click({force: true});
});

//Fill checkout details form
Cypress.Commands.add("fillCheckoutForm", (firstName, lastName, pincode) => {
    cy.get('[data-test="firstName"]').should('be.visible')
        .clear()
        .type(firstName);
    cy.get('#last-name').should('be.visible')
        .clear()
        .type(lastName);
    cy.get('[data-test="postalCode"]').should('be.visible')
        .clear()
        .type(pincode);
    cy.get('#continue').should('be.visible').click({force: true});
});

