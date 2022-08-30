const router = require("express").Router();
const Post = require("../models/Post");

const postsDB = require("../db/posts");

//homepage
router.get("/", function (req, res) {
    Post.find()
        .lean()
        .then((posts) => {
            req.status(200);
            res.render("home", { posts: posts });
        })
        .catch((err) => {
            req.status(400).flash("error", "Houve um erro interno!");
            res.redirect("/404");
        });
});

module.exports = router;
