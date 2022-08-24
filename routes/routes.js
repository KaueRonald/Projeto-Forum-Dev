const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const { eAdmin, checkPostOwnership } = require("../helpers/admin");
const { default: mongoose } = require("mongoose");
require("../models/User");
require("../models/Post");
require("../models/Comment");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");

router.get("/", function (req, res) {
    Post.find()
        .lean()
        .then((posts) => {
            res.render("home", { posts: posts });
        })
        .catch((err) => {
            req.flash("error", "Houve um erro interno!");
            res.redirect("/404");
        });
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.get("/profile/:id", function (req, res) {
    Comment.find({ authorId: req.params.id })
        .lean()
        .sort({ data: "desc" })
        .then((comments) => {
            Post.find({ authorId: req.params.id })
                .lean()
                .sort({ data: "desc" })
                .then((posts) => {
                    User.findById(req.params.id)
                        .lean()
                        .then((user) => {
                            let comp;

                            if (req.user) {
                                if (
                                    JSON.stringify(user._id) !==
                                        JSON.stringify(req.user._id) ||
                                    req.user._id === undefined
                                ) {
                                    comp = false;
                                } else {
                                    comp = true;
                                }
                            } else {
                                comp = false;
                            }
                            res.render("profile", {
                                comments: comments,
                                posts: posts,
                                commentsCont: comments.length,
                                postsCont: posts.length,
                                user: user,
                                comp: comp,
                            });
                        });
                });
        });
});

router.get("/editProfile/:id", eAdmin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .lean()
        .then((user) => {
            res.render("editProfile", { user: user });
        })
        .catch((err) => {
            req.flash("error", "Ocorreu um erro interno");
            res.redirect("/");
        });
});

router.post("/editProfile/:id", eAdmin, (req, res) => {
    User.findById(req.params.id)
        .then((updateUser) => {
            (updateUser.displayName = req.body.displayNome),
                (updateUser.email = req.body.email),
                (updateUser.password = req.body.password),
                (updateUser.bio = req.body.bio),
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(updateUser.password, salt, (err, hash) => {
                        if (err) {
                            req.flash("error", "Erro ao criar usuário.");
                            res.redirect("/");
                        }

                        updateUser.password = hash;
                        updateUser
                            .save()
                            .then(() => {
                                Post.find({ authorId: req.params.id }).then(
                                    (posts) => {
                                        for (let i = 0; i < posts.length; i++) {
                                            posts[i].authorName =
                                                updateUser.displayName;
                                            posts[i].save();
                                        }
                                    }
                                );

                                req.flash(
                                    "success",
                                    "Usuário editado com sucesso!"
                                );
                                res.redirect("/");
                            })
                            .catch((err) => {
                                req.flash("error", "Erro interno");
                                res.redirect("/");
                            });
                    });
                });
        })
        .catch((err) => {
            req.flash(
                "error",
                "Ocorreu um erro ao salvar as alterações na edição do usuário"
            );
            res.redirect("/");
        });
});

router.get("/signup", function (req, res) {
    res.render("signup");
});

router.post("/login", function (req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })(req, res, next);
});

router.get("/logout", function (req, res) {
    req.logout(function (err) {
        req.flash("success", "Deslogado com sucesso!");
        if (err) {
            return next(err);
        }

        res.redirect("/");
    });
});

router.post("/signup", function (req, res) {
    let errs = [];

    const email = req.body.email;
    const displayName = req.body.displayName;
    const password = req.body.password;
    const password2 = req.body.password2;

    if (!email || typeof email == undefined || email == null) {
        errs.push({ text: "Email invalido" });
    }

    if (!password || typeof password == undefined || password == null) {
        errs.push({ text: "Password invalido." });
    }

    if (password.length < 8) {
        errs.push({ text: "Password tem que ter no mínimo 8 caracteres." });
    }

    if (password != password2) {
        errs.push({ text: "Os password são diferente." });
    }

    if (errs.length > 0) {
        res.render("signup", { errs: errs });
    } else {
        User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    req.flash("error", "Email já cadastrado.");
                    res.redirect("/signup");
                } else {
                    const newUser = new User({
                        displayName: displayName,
                        email: email,
                        password: password,
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                req.flash("error", "Erro ao criar usuário.");
                                res.redirect("/");
                            }

                            newUser.password = hash;
                            newUser
                                .save()
                                .then((user) => {
                                    req.flash(
                                        "success",
                                        "Usuário criado com sucesso."
                                    );
                                    res.redirect("/");
                                })
                                .catch((err) => {
                                    req.flash(
                                        "error",
                                        "Erro ao criar usuário, tente novamente."
                                    );
                                    res.redirect("/signup");
                                });
                        });
                    });
                }
            })
            .catch((err) => {
                req.flash("error", "Erro ao cadastrar usuário.");
                res.redirect("/");
            });
    }
    passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/signup",
        failureFlash: true,
    });
});

router.get("/newPost", eAdmin, (req, res) => {
    res.render("newPost");
});

router.post("/addPost", eAdmin, (req, res) => {
    const newPost = {
        title: req.body.title,
        content: req.body.content,
        authorId: req.user.id,
        authorName: req.user.displayName,
    };

    new Post(newPost)
        .save()
        .then(() => {
            req.flash("success", "Postagerm criada com sucesso");
            res.redirect("/");
        })
        .catch((err) => {
            req.flash("error", "Houve um erro na criação da postagem");
            res.redirect("/");
        });
});

router.get("/postContent/:id", (req, res) => {
    Post.findOne({ _id: req.params.id })
        .lean()
        .then((post) => {
            Comment.find({ postId: req.params.id })
                .lean()
                .sort({ createdAt: "descending" })
                .then((comments) => {
                    res.render("postContent", {
                        post: post,
                        comments: comments,
                    });
                });
        })
        .catch((err) => {
            req.flash("error", "Ocorreu um erro interno");
            res.redirect("/");
        });
});

router.get("/deletePost/:id", eAdmin, checkPostOwnership, (req, res) => {
    Post.deleteMany({ _id: req.params.id })
        .then(() => {
            Comment.deleteMany({ postId: req.params.id }).then(() => {
                req.flash("success", "Postagem deletada com sucesso!");
                res.redirect("/");
            });
        })
        .catch((err) => {
            req.flash("error", "Erro interno ao tentar deletar postagem");
            res.redirect("/");
        });
});

router.get("/editPost/:id", eAdmin, checkPostOwnership, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .lean()
        .then((post) => {
            res.render("editPost", { post: post });
        })
        .catch((err) => {
            req.flash("error", "Ocorreu um erro interno");
            res.redirect("/");
        });
});

router.post("/editPost", eAdmin, (req, res) => {
    Post.findOne({ _id: req.body.id })
        .then((post) => {
            post.title = req.body.title;
            post.subTitle = req.body.subTitle;
            post.description = req.body.description;
            post.content = req.body.content;

            post.save()
                .then(() => {
                    req.flash("success", "Postagem editada com sucesso!");
                    res.redirect("/");
                })
                .catch((err) => {
                    req.flash("error", "Erro interno");
                    res.redirect("/");
                });
        })
        .catch((err) => {
            req.flash(
                "error",
                "Ocorreu um erro ao salvar as alterações na edição da postagem"
            );
            res.redirect("/");
        });
});

module.exports = router;
