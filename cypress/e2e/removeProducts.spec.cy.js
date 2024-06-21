/// <reference types="cypress" />

describe('Cart Functionality Tests',{ testIsolation: false }, () => {

    it("Login as standard user", () => {
        cy.visit(Cypress.config("baseUrl"));
        cy.login(Cypress.config('validUsername'), Cypress.config('validPassword'));
        cy.url()
            .should('include', '/inventory.html');
    });

    it('Remove a single product from the cart', () => {
        cy.addProduct('add-to-cart-sauce-labs-bolt-t-shirt');

        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('have.length', 1);

        //Removing the product from cart.
        cy.get('.cart_button').click();  
        cy.get('.cart_item').should('have.length', 0);
    
        cy.get('[data-test="continue-shopping"]').click({force: true});
    });

    it('Remove one product from multiple products in the cart', () => {
        cy.addProduct('add-to-cart-sauce-labs-backpack');
        cy.addProduct('add-to-cart-sauce-labs-bike-light');

        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('have.length', 2);

        //Removing the product from cart.
        cy.get('.cart_button').first().click();
        cy.get('.cart_item').should('have.length', 1);

        cy.get('[data-test="continue-shopping"]').click({force: true});
    });

    it('Remove all products from the cart', () => {
        cy.emptyCart();
        cy.addProduct('add-to-cart-sauce-labs-backpack');
        cy.addProduct('add-to-cart-sauce-labs-bike-light');

        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('have.length', 2);

        //Removing the products from cart.
        cy.get('.cart_button').each(($btn) => {
            cy.wrap($btn).click();
        });
        cy.get('.cart_item').should('have.length', 0);

        cy.get('[data-test="continue-shopping"]').click({force: true});
    });

    it('Remove product and verify cart total updates correctly', () => {
        let initialTotal;

        cy.addProduct('add-to-cart-sauce-labs-backpack');
        cy.addProduct('add-to-cart-sauce-labs-bike-light');

        cy.get('.shopping_cart_link').click();
        cy.get('[data-test="checkout"]').click({force: true});

        // Filling the checkout form
        cy.fillCheckoutForm(Cypress.config('shippingFirstName'), Cypress.config('shippingLastName'), Cypress.config('postalCode'));
        cy.get('.summary_subtotal_label').invoke('text').then(text => {
            initialTotal = parseFloat(text.split("$")[1]);
        });

        // Moving to cart page to verify the amount before removing the product.
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_button').first().click();
        cy.get('[data-test="checkout"]').click({force: true});

        // Moving back to cart page to verify the amount after removing the products.
        cy.fillCheckoutForm(Cypress.config('shippingFirstName'), Cypress.config('shippingLastName'), Cypress.config('postalCode'));
        cy.get('.summary_subtotal_label').invoke('text').then(text => {
            const newTotal = parseFloat(text.split("$")[1]);
            expect(newTotal).to.be.lessThan(initialTotal);
        });

        cy.get('[data-test="cancel"]').click({force: true});
    });

    it('Remove product and verify UI updates correctly', () => {
        cy.addProduct('add-to-cart-sauce-labs-backpack');

        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('have.length', 2);

        //Removing all the products.
        cy.get('.cart_button').each(($btn) => {
            cy.wrap($btn).click();
        });
        cy.get('.cart_item').should('have.length', 0);

        //Verifying that the shopping cart badge has no number.
        cy.get('.shopping_cart_badge').should('not.exist');
    });
});
