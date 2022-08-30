const request = require("supertest");
const app = require("../app");

it("Deve buscar todos os posts", async () => {
    const response = await request(app).get("/api/posts");

    expect(Array.isArray(response.body.post)).toBe(true);
    expect(response.statusCode).toBe(200);
});

it("Espera que retorne um erro ao fazer o login", async () => {
    const response = await request(app).post("/api/login").send({
        email: "mtrigao@gmail.com",
        password: "12345678",
    });

    expect(response.body).toEqual({ error: "Email ou senha inválidos" });
});

// it("testando rota home da página, esperando status 200 para sucesso", () => {
//     const response = request(app).get("/");
//     console.log(response.body);
//     expect(response.statusCode).toBe(200);
// });
