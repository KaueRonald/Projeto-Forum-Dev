const router = require("express").Router();
const postsDB = require("../../db/posts");
const commentsDB = require("../../db/comment");
const usersDB = require("../../db/user");
const passport = require("passport");
const bcrypt = require("bcrypt");

//Route login
router.post("/api/login", (req, res) => {
    usersDB.getUserEmail(req.body.email).then((user) => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(400).json({
                        error: "Erro ao logar",
                    });
                }

                if (isMatch) {
                    return res.status(200).json({
                        message: "Usuário logado com sucesso",
                        user: user,
                    });
                } else {
                    return res.status(400).json({
                        error: "Email ou senha inválidos",
                    });
                }
            });
        } else {
            return res.status(400).json({
                error: "Email ou senha inválidos",
            });
        }
    });
});

//Routes for posts
//retorna os posts
router.get("/api/posts", function (req, res) {
    postsDB
        .getAllPosts()
        .then((posts) => {
            return res.json({
                post: posts,
                message: "Posts retornados com sucesso",
            });
        })
        .catch((err) => {
            return res.json({ error: err });
        });
});
//retorna o post pelo id
router.get("/api/posts/:id", function (req, res) {
    postsDB
        .getPostById(req.params.id)
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});
//
router.post("/api/createPosts", (req, res) => {
    const { title, content, authorName, authorId } = req.body;
    const item = {
        title,
        content,
        authorName,
        authorId,
    };
    return res.json({ item });
    postsDB
        .insertPost(item)
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.put("/api/posts", (req, res) => {
    const { title, content, id } = req.body;
    postsDB
        .updatePost(id, content, title)
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.delete("/api/posts/:id", (req, res) => {
    postsDB
        .deletePost(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

//Routes for comments
router.get("/api/comments/:id", (req, res) => {
    commentsDB
        .getAllCommentsUser(req.params.id)
        .then((comments) => {
            res.status(200).json(comments);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.post("/api/createComments", (req, res) => {
    const comment = {
        content: req.body.content,
        postId: req.body.postId,
        authorId: req.body.authorId,
        authorName: req.body.authorName,
    };
    commentsDB
        .insertComment(comment)
        .then((comments) => {
            res.status(200).json(comments);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.put("/api/editComment/:id", (req, res) => {
    const { content } = req.body;
    commentsDB
        .updateComment(req.params.id, content)
        .then((comment) => {
            res.status(200).json(comment);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.delete("/api/deleteComments/:id", (req, res) => {
    commentsDB
        .deleteCommentsUser(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

//Routes for users
router.get("/api/user/:id", (req, res) => {
    usersDB
        .getUser(req.params.id)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.post("/api/createUser", (req, res) => {
    const newUser = {
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password,
    };
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            usersDB
                .createUser(newUser)
                .then((user) => {
                    res.status(200).json({
                        message: "Usuário criado com sucesso!",
                        user: user,
                    });
                })
                .catch((err) => {
                    res.status(500).json(err);
                });
        });
    });
});

router.put("/api/editUser/:id", (req, res) => {
    const updateUser = {
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
    };
    const { displayName, email, password } = req.body;
    usersDB
        .updateUser(req.params.id, updateUser, req.body.img)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.delete("/api/deleteUser/:id", (req, res) => {
    usersDB
        .deleteUser(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;
