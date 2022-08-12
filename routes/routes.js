const router = require("express").Router();

router.get("/profile", function (req, res) {
  res.render("profile");
});

router.get("/signup", function (req, res) {
  res.render("signup");
});

module.exports = router;
