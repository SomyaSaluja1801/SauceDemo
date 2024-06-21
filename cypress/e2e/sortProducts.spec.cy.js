/// <reference types="cypress" />

describe('Sort available Products in Swag Labs',{ testIsolation: false }, () => {

    it('Login with the standard user', () => {
        cy.visit(Cypress.config("baseUrl"));
        cy.login(Cypress.config('validUsername'), Cypress.config('validPassword'));
        cy.url()
            .should('include', '/inventory.html');
    })
  
    describe('Verify sorting of products by Price (low to high)', () => {

        it('Verify the product count before and after sorting is same', () => {
            cy.get('.product_sort_container').should('be.visible');
            cy.productsCount().then((productsBeforeSorting) => {
                cy.selectSortOption('Price (low to high)');
    
                cy.productsCount().then((productsAfterSorting) => {
                    expect(productsAfterSorting).to.equal(productsBeforeSorting);
                });
            });
        });
       
        it('Fetch the products prices ,sort them to verify if the products are displayed in correct order', () => {
            let priceBucket = [];
            cy.get('.pricebar').each(($element) => {
                const price = $element.find('.inventory_item_price')
                    .text()
                    .split('$')[1]
                priceBucket.push(price);
            });
            let sortedPriceList = priceBucket.sort();
            expect(sortedPriceList).to.deep.equal(priceBucket);
        });
    });

    describe('Verify sorting of prodcuts by Name (A to Z)', () => {

        it('Verify the product count before and after sorting is same', () => {
            cy.get('.product_sort_container').should('be.visible');
            cy.productsCount().then((productsBeforeSorting) => {
                cy.selectSortOption('Name (A to Z)');

                cy.productsCount().then((productsAfterSorting) => {
                    expect(productsAfterSorting).to.equal(productsBeforeSorting);
                });
            });
        });

        it('Fetch the products name ,sort them to verify if the products are displayed in correct order', () => {
            let productNameList = [];
            cy.get('.inventory_item_label').each(($element) => {

                const productName = $element.find('.inventory_item_name')
                    .text()
                productNameList.push(productName);
            }).then(() => {
                productNameList.forEach((item) => {
                    cy.log('Bucket list', item);
                });
            });
            let sortedNames = productNameList.sort();
            expect(sortedNames).to.deep.equal(productNameList);
        });
    });
});