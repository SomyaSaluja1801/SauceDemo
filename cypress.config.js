const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: "https://www.saucedemo.com/",
    validUsername: "standard_user",
    invalidUsername: "invalidUser",
    validPassword: "secret_sauce",
    invalidPassword: "invalidpassword",
    lockedUser: "locked_out_user",
    shippingFirstName: "Somya",
    shippingLastName: "Saluja",
    postalCode: "10944",
    noOfProductsBought: 3,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
