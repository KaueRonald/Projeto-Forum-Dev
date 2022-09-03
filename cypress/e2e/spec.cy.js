describe("Deve cadastrar um novo usuario", () => {
    it("Deve clicar no botão de cadastrar e redirecionar a pagina", () => {
        cy.visit("http://localhost:3000");
        cy.get("#signup").click();

        cy.url().should("include", "/signup");
    });

    it("Deve cadastrar um novo usuario", () => {
        cy.get("#name").type("Cypress");
        cy.get("#email").type("cypress@gmail.com");
        cy.get("#password").type("12345678");
        cy.get("#password_confirmation").type("12345678");
        cy.get("#cadastrar").click();

        cy.url().should("include", "/");
    });
});

describe("Fazer Login na Aplicação", () => {
    it("Deve clicar no botão de login e redirecionar a pagina", () => {
        cy.visit("http://localhost:3000");
        cy.get("#login").click();

        cy.url().should("include", "/login");
    });

    it("Deve preencher o campo de email e senha", () => {
        cy.get("#email").type("cypress@gmail.com");
        cy.get("#password").type("12345678");

        cy.get("#entrar").click();

        cy.get("#logout").should("be.visible");
    });
});
