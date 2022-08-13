const router = require("express").Router();

router.get("/", function (req, res) {
  res.render("home");
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", function (req, res) {
//mudar página de renderização para criação do tópico quando for feita e fazer a autentiação de entrada
  res.render("home");
});

router.get("/profile", function (req, res) {
  res.render("profile");
});

router.get("/signup", function (req, res) {
  res.render("signup");
});

module.exports = router;
