const router = require("express").Router();
const userController = require("../../controllers/user/user.controller");
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
    userController.createUser(req, res);
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
