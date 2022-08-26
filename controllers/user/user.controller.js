const User = require("../../models/User");
const passport = require("passport");
const bcrypt = require("bcrypt");

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
    },
};

module.exports = userController;
