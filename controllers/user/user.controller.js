const User = require("../../models/User");
const userDB = require("../../db/user");
const postsDB = require("../../db/posts");
const commentsDB = require("../../db/comment");
const passport = require("passport");
const bcrypt = require("bcrypt");
const fs = require("fs");

const userController = {
    //Create user
    createUser: (req, res) => {
        let errs = [];
        const newUser = new User({
            displayName: req.body.displayName,
            email: req.body.email,
            password: req.body.password,
        });

        if (
            !req.body.email ||
            typeof req.body.email == undefined ||
            req.body.email == null
        ) {
            errs.push({ text: "Email invalido" });
        }

        if (
            !req.body.password ||
            typeof req.body.password == undefined ||
            req.body.password == null
        ) {
            errs.push({ text: "Password invalido." });
        }

        if (req.body.password.length < 8) {
            errs.push({ text: "Password tem que ter no mínimo 8 caracteres." });
        }

        if (req.body.password != req.body.password2) {
            errs.push({ text: "Os password são diferente." });
        }

        if (errs.length > 0) {
            res.render("signup", { errs: errs });
        } else {
            User.findOne({ email: req.body.email })
                .then((user) => {
                    if (user) {
                        req.flash("error", "Email já cadastrado.");
                        res.redirect("/signup");
                    } else {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) {
                                    req.flash(
                                        "error",
                                        "Erro ao criar usuário."
                                    );
                                    res.redirect("/");
                                }

                                newUser.password = hash;
                                userDB
                                    .createUser(newUser)
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
    },

    deleteUser: (req, res) => {
        userDB
            .deleteUser(req.params.id)
            .then((result) => {
                if (result) {
                    postsDB
                        .deletePostsUser(req.params.id)
                        .then((result) => {
                            if (result) {
                                commentsDB
                                    .deleteCommentsUser(req.params.id)
                                    .then((result) => {
                                        if (result) {
                                            req.flash(
                                                "success",
                                                "Usuário excluído com sucesso!"
                                            );
                                            res.redirect("/");
                                        } else {
                                            req.flash(
                                                "error",
                                                "Erro ao excluir comentários"
                                            );
                                            res.redirect("back");
                                        }
                                    });
                            } else {
                                req.flash(
                                    "error",
                                    "Erro ao excluir as postagens do usuário"
                                );
                                res.redirect("back");
                            }
                        })
                        .catch((err) => {
                            res.redirect("/");
                        });
                } else {
                    req.flash("error", "Erro ao excluir usuário");
                    res.redirect("back");
                }
            })
            .catch((err) => {
                res.redirect("/");
            });
    },

    updateUser: (req, res) => {
        const img = fs.readFileSync("./public/uploads/" + req.file.filename, {
            encoding: "base64",
        });
        userDB
            .updateUser(req.params.id, req.body, img)
            .then((result) => {
                if (result) {
                    req.flash("success", "Usuário atualizado com sucesso!");
                    res.redirect("/profile/" + req.params.id);
                } else {
                    req.flash("error", "Erro ao atualizar usuário");
                    res.redirect("back");
                }
            })
            .catch((err) => {
                res.redirect("/");
            }),
            (err) => {
                res.redirect("/");
            };
    },

    getUserById: (req, res) => {
        userDB
            .getUser(req.params.id)
            .then((user) => {
                if (user) {
                    res.render("editProfile", { user: user });
                } else {
                    req.flash("error", "Usuário não encontrado");
                    res.redirect("/profile/" + req.params.id);
                }
            })
            .catch((err) => {
                res.redirect("/");
            }),
            (err) => {
                res.redirect("/");
            };
    },
};

module.exports = userController;
