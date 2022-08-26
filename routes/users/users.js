const router = require("express").Router();
const helpers = require("../../helpers/admin");
const user = require("../../models/User");
const passport = require("passport");

//renderização da página de Login
router.get("/login", function (req, res) {
    res.render("login");
});
//Login
router.post("/login", function (req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })(req, res, next);
});

//Cadastro
router.get("/signup", function (req, res) {
    res.render("signup");
});
//Rota post de Cadastro
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

//Sair
router.get("/logout", function (req, res) {
    req.logout(function (err) {
        req.flash("success", "Deslogado com sucesso!");
        if (err) {
            return next(err);
        }

        res.redirect("/");
    });
});

module.exports = router;
