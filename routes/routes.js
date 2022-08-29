const router = require("express").Router();
const Post = require("../models/Post");

const postsDB = require("../db/posts");

//homepage
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

module.exports = router;
