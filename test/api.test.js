const comments = require("../models/Comment");
const posts = require("../models/Post");
const users = require("../models/User");

const commentsDB = require("../db/comment");
const postsDB = require("../db/posts");
const usersDB = require("../db/user");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/forum-api-new");

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
    let status;
    //É necessário sempre mudar o email pois não pode cadastrar um usuário com o mesmo email!
    const user = {
        displayName: "Tester",
        email: "kaue22@test.com",
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

test("É esperado que retorna todas as postagens", async () => {
    let result = await postsDB.getAllPosts();

    expect(Array.isArray(result)).toBe(true);
});

test("É esperado que retorna os comentários por id de user", async () => {
    const newComment = {
        content: "Teste de comentário",
        postId: "5e9f8f8f8f8f8f8f8f8f8f8",
        authorId: "5e9f8f8f8f9f8f8f8f8f8f8",
        authorName: "Tester",
    };
    comments.create(newComment);
    let result = await commentsDB.getAllCommentsUser(newComment.authorId);

    expect(Array.isArray(result)).toBe(true);
});

test("É esperado que retorne true se o email cadastrado não existe", async () => {
    const newUser = {
        displayName: "João",
        email: "joao1@gmail.com",
        password: "12345678",
    };
    usersDB.createUser(newUser);

    let result = true;

    users
        .findOne({ email: newUser.email })
        .then((result) => {
            if (result) {
                result = false;
            } else {
                result = true;
            }
        })
        .catch((err) => {
            console.log("Ocorreu um erro interno: " + err);
        });

    expect(result).toBe(true);
});

test("É esperado que apague o comentário por postId", async () => {
    const comment = {
        content: "Teste wdwedde comentário",
        postId: "5e9f8f8f8f8f8f8f8dwedewf8f8f8",
        authorId: "5e9f8f8f8f9f8dsdf8f8f8f8f8",
        authorName: "Teewdster",
    };

    commentsDB.insertComment(comment);

    let result = await commentsDB.deleteCommentsPost(comment.postId);

    expect(result).toBe(true);
});

test("É esperado que a postagem com determinado id seja excluída do banco", async () => {
    const post = {
        title: "Teste de postt",
        content: "eu não gosto de testee",
        authorId: "12321321314",
        authorName: "Tester",
    };
    let checkDelete = false;
    postsDB.insertPost(post);

    let result = await postsDB.deletePostsUser(post.authorId);
    // posts
    //     .findOne({ authorId: post.authorID })
    //     .then((post) => {
    //         postsDB.deletePostsUser(post.authorId);
    //         checkDelete = true;
    //     })
    //     .catch((err) => {
    //         console.log("Ocorreu um erro interno: " + err);
    //         checkDelete = false;
    //     });
    expect(result).toBe(true);
});

test("É esperado que a postagem seja atualizado ", async () => {
    const upPost = {
        title: "Teste dejyuj post",
        content: "eu não gosto de teste",
        authorId: "1232132erhykk1312",
        authorName: "Tesjyujter",
    };
    postsDB.insertPost(upPost).then((post) => {
        let id = post._id;
        upPost.content = "eu gosto de testes";
        postsDB.updatePost(post._id, upPost.content).then((updatePost) => {
            expect(updatePost.content).toBe(upPost.content);
        });
    });
});

test("É espera que o comentario seja atualizado", async () => {
    const newComment = {
        content: "Teste de comentárioferfer",
        postId: "5e9f8f8f8f8f8f8f8dferfef8f8f8",
        authorId: "5e9f8f8f8f9fferfer8f8f8f8f8f8",
        authorName: "Teserferter",
    };

    commentsDB.insertComment(newComment).then((comment) => {
        let id = comment._id;
        newComment.content = "Teste de comentário atualizado1";
        commentsDB
            .updateComment(comment._id, newComment.content)
            .then((updateComment) => {
                expect(updateComment.content).toBe(newComment.content);
            });
    });
});
