# SauceDemo
This repository contains automated tests for the SauceDemo e-commerce platform using Cypress.io. The tests cover various functionalities of the application, including login, shopping cart operations, checkout flow, and more.

## Features
1. **Login Tests**: Verifies user authentication with valid and invalid credentials.<br />
2. **Cart Functionality**: Tests adding products in the cart and sorting the products. <br />
3. **Checkout Process**: Validates the checkout process, including filling in user details and verifying order summary.<br />
4. **Product Removal**: Validates the products removal from user cart.<br />
5. **Logout Tests**: Verifies user logs out of the application successfully.<br />

## Installation
1. **Clone the repository**: `git clone https://github.com/SomyaSaluja1801/SauceDemo`
2. **Install dependencies**: `npm install`

## Usage
### Running Tests
1. **Open Cypress Test Runner**: `npx cypress open`
2. **Run Tests in Headless Mode**: This will generate mochawesome report as well `npx cypress run`
