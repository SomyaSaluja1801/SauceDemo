/// <reference types="cypress" />

const userItems = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt']
let priceBucket = [];
let totalSum = 0;
let cartTotal, tax, cartValueWithTax;

describe('Verify the checkout flow for standard user in Sauce demo', { testIsolation: false } ,() => {

    it("3.1.1. Login as standard user", () => {
        cy.visit(Cypress.config("baseUrl"));
        cy.login(Cypress.config('validUsername'), Cypress.config('validPassword'));
        cy.url()
            .should('include', '/inventory.html');
    });

    it('3.1.2. Add few products to the cart', () => {
        cy.get('.btn.btn_primary.btn_small.btn_inventory').should('be.visible');

        // Add products to the cart.
        cy.addProduct('add-to-cart-sauce-labs-backpack');
        cy.addProduct('add-to-cart-sauce-labs-bike-light');
        cy.addProduct('add-to-cart-sauce-labs-bolt-t-shirt');

        //Verify the cart shows the count of products added.
        cy.get('.shopping_cart_link').should('be.visible')
            .find('.shopping_cart_badge')
            .should('have.text', Cypress.config("noOfProductsBought"));
    });

    it('3.1.3. Checkout the cart', () => {

        // Navigating to checkout page.
        cy.get('.shopping_cart_link').should('be.visible').click({force: true});

        //Scenario 1. Checking if the user landed on the correct URL.
        cy.url()
            .should('include', '/cart.html');
        cy.xpath('//span[@data-test = "title"]').should('be.visible')
            .contains('Your Cart');

        // Scenario 2. Checking the number of products and quantity
        cy.xpath("//div[@class ='cart_item']").should('have.length', '3');
        cy.xpath('//div[@data-test = "item-quantity"]').each(($item) => {
            cy.wrap($item).invoke('text').should('eq', '1');
        });

        // Scenario 3. Checking that the button along with the product is 'Remove'.
        cy.get('.btn.btn_secondary.btn_small.cart_button').each(($item) => {
            cy.wrap($item).invoke('text').should('contain', 'Remove');
        });

        //Scenario 4. Verify the names of the items added in cart.
        cy.get('.inventory_item_name').each(($product, index) => {
            cy.wrap($product).invoke('text').should('eq', userItems[index]);
        });

        
        // Verify checkout button is visible and user gets redirected to the checkout page after clicking.
        cy.get('[data-test="checkout"]').should('be.visible'); 
    });

    // Add delivery details
    describe('3.1.4. Add delivery details',() => {
        it('Verify the page renders successfully', () => {
        cy.get('[data-test="checkout"]').should('be.visible').click({force: true});
        cy.url()
            .should('include', '/checkout-step-one.html');
        cy.get('[data-test = "title"]').should('be.visible')
            .invoke('text')
            .should('eq','Checkout: Your Information');
        });
        
        it('Verify the required field validation on missing details - FirstName', () => {
            cy.get('#last-name').should('be.visible')
                .clear()
                .type('Wick');
            cy.get('[data-test="postalCode"]').should('be.visible')
                .clear()
                .type('2233');
            cy.get('#continue').should('be.visible').click({force: true});
            cy.verifyErrorMessage('Error: First Name is required');
        });

        it('Verify the required field validation on missing details - LastName', () => {
            cy.get('[data-test="firstName"]').should('be.visible')
                .clear()
                .type('Hilly');
            cy.get('#last-name').clear()
            cy.get('[data-test="postalCode"]').should('be.visible')
                .clear()
                .type('2233');
            cy.get('#continue').should('be.visible').click({force: true});
            cy.verifyErrorMessage('Error: Last Name is required');
        });

        it('Verify the required field validation on missing details - Pincode', () => {
            cy.get('[data-test="firstName"]').should('be.visible')
                .clear()
                .type('Hilly');
            cy.get('#last-name').should('be.visible')
                .clear()
                .type('Wick');
            cy.get('[data-test="postalCode"]').clear()
            cy.get('#continue').should('be.visible').click({force: true});
            cy.verifyErrorMessage('Error: Postal Code is required');
        });

        it("Fill checkout form with all details", () => {
            cy.fillCheckoutForm(Cypress.config('shippingFirstName'), Cypress.config('shippingLastName'), Cypress.config('postalCode'));
        });
    });

    //Review checkout summary
    describe('3.1.5. Review the checkout summary', () => {
        it('Verify the Checkout Overview page renders with all details successfully', () => {
            cy.get('span.title').should('be.visible')
                .and('have.text', 'Checkout: Overview');
            cy.productsCount().then((count) => {
                expect(count).to.equal(Cypress.config("noOfProductsBought"));
            });
        });
        
        it('Verify the Payment Information and Shipping Information are available before order', () => {
            cy.get('[data-test="payment-info-value"]').should('be.visible');
            cy.get('[data-test="shipping-info-value"]').should('be.visible');
        });

        it('Verify the Cart total and products prices is correct', () => {

            // Checking the Item total and sum of prices of products are equal.
            cy.get('.summary_subtotal_label').invoke('text')
                .then((text) => {
                    cartTotal = parseFloat(text.trim().split('$')[1]);
                    cy.wrap(cartTotal).as('cartTotal')
                });

            cy.get('.item_pricebar').each(($element) => {
                const priceText = $element.find('.inventory_item_price')
                    .text()
                const price = parseFloat(priceText.split('$')[1]);
                priceBucket.push(price);
                totalSum += price; 
                cy.wrap(totalSum).as('totalSum')
            })
            .then(() => {
                expect(totalSum).to.equal(cartTotal)
            });
    
            //Checking the Total amount after tax is correct
            cy.get('[data-test="tax-label"]').invoke('text')
                .then((text) => {
                    tax = parseFloat(text.trim().split('$')[1]);
                    cy.wrap(tax).as('tax')
                });

            cy.get('.summary_total_label').invoke('text')
                .then((text) => {
                    cartValueWithTax = parseFloat(text.trim().split('$')[1]);
                    cy.wrap(cartValueWithTax).as('cartValueWithTax')
                });

            // Checking the Item Total + taxes = Total.
            cy.get('@cartTotal').then((cartTotal) => {
                cy.get('@totalSum').then((totalSum) => {
                    expect(totalSum).to.equal(cartTotal);
                    cy.get('@tax').then((tax) => {
                    cy.get('@cartValueWithTax').then((cartValueWithTax) => {
                            const totalAmount = cartTotal + tax;
                            expect(cartValueWithTax).to.equal(totalAmount);
                        });
                    });
                });
            });
        });   
    });

    describe('3.1.6. Place the order', () => {
        it('Verify finish button is visible', () => {
            cy.url()
                .should('include', '/checkout-step-two.html');
            cy.get('[data-test="finish"]').should('be.visible').click({force: true});
        })

        it('Verify the user gets navigated to the next page successfully', () => {
            cy.url()
                .should('include', 'https://www.saucedemo.com/checkout-complete.html');
        })
    });

    describe('3.1.7. Order summary', () => {

        it('Verify the user gets navigated to the next page successfully', () => {
            cy.url()
                .should('include', 'https://www.saucedemo.com/checkout-complete.html');
        });

        it('Verify the components on the page', () => {
            cy.get('[data-test="title"]').should('have.text', 'Checkout: Complete!');
            cy.get('[data-test="complete-header"]').should('have.text', 'Thank you for your order!');
            cy.get('[data-test="complete-text"]').should('have.text', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!')
        });
    });
});