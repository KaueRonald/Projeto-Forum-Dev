const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

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
          req.flash("error_msg", "Email já cadastrado.");
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
                req.flash("error_msg", "Erro ao criar usuário.");
                res.redirect("/");
              }

              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash("success_msg", "Usuário criado com sucesso.");
                  res.redirect("/");
                })
                .catch((err) => {
                  req.flash(
                    "error_msg",
                    "Erro ao criar usuário, tente novamente."
                  );
                  res.redirect("/signup");
                });
            });
          });
        }
      })
      .catch((err) => {
        req.flash("error_msg", "Erro ao cadastrar usuário.");
        res.redirect("/");
      });
  }
});

module.exports = router;
