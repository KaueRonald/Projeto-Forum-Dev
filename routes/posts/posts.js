const router = require("express").Router();
const postsController = require("../../controllers/posts/posts.controller");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const helpers = require("../../helpers/admin");

//Postagem
router.get("/newPost", helpers.eAdmin, (req, res) => {
    res.render("newPost");
});

router.post("/addPost", helpers.eAdmin, (req, res) => {
    postsController.addPost(req, res);
});
//Deletar postagem
router.get(
    "/deletePost/:id",
    helpers.eAdmin,
    helpers.checkPostOwnership,
    (req, res) => {
        postsController.deletePost(req, res);
    }
);
//Pegar postagem por id
router.get("/postContent/:id", (req, res) => {
    Post.findOne({ _id: req.params.id })
        .lean()
        .then((post) => {
            Comment.find({ postId: req.params.id })
                .lean()
                .sort({ createdAt: "descending" })
                .then((comments) => {
                    res.render("postContent", {
                        post: post,
                        comments: comments,
                    });
                });
        })
        .catch((err) => {
            req.flash("error", "Ocorreu um erro interno");
            res.redirect("/");
        });
});

//Pegando editar Post por id
router.get(
    "/editPost/:id",
    helpers.eAdmin,
    helpers.checkPostOwnership,
    (req, res) => {
        Post.findOne({ _id: req.params.id })
            .lean()
            .then((post) => {
                res.render("editPost", { post: post });
            })
            .catch((err) => {
                req.flash("error", "Ocorreu um erro interno");
                res.redirect("/");
            });
    }
);
//Editar post
router.post("/editPost", helpers.eAdmin, (req, res) => {
    postsController.editPost(req, res);
});

module.exports = router;
