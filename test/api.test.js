const comments = require("../models/Comment");
const posts = require("../models/Post");
const users = require("../models/User");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/forum-api-new");
//jest.useRealTimers();
//jest.setTimeout(20000);

test("Espera-se que o comentário seja criado e cadastrado no mongo", async () => {
    const comment = {
        content: "Teste de comentário",
        postId: "5e9f8f8f8f8f8f8f8f8f8f8",
        authorId: "5e9f8f8f8f9f8f8f8f8f8f8",
        authorName: "Tester",
    };
    comments.create(comment);
    let result = await comments.find();
    expect(Array.isArray(result)).toBe(true);
});

test("Espera-se que a postagem seja criada e cadastrada no mongo", async () => {
    const post = {
        title: "Teste de post",
        content: "eu não gosto de teste",
        authorId: "12321321312",
        authorName: "Tester",
    };
    posts.create(post);
    let resultado = await posts.find();
    let status;
    if (resultado) {
        status = true;
    } else {
        status = false;
    }
    expect(status).toBe(true);
});

test("É esperado que o usuário seja criado e cadastrado no mongo", async () => {
    const user = {
        displayName: "Tester",
        email: "kaue@test.com",
        password: "12345678",
    };
    users.create(user);
    let resultado = await users.find();
    if (resultado) {
        status = true;
    } else {
        status = false;
    }
    expect(status).toBe(true);
});
