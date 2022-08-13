const router = require("express").Router();

router.get("/", function (req, res) {
  res.render("home");
});

router.get("/profile", function (req, res) {
  res.render("profile");
});

router.get("/signup", function (req, res) {
  res.render("signup");
});

module.exports = router;
