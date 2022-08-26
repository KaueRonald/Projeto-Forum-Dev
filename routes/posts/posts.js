const router = require("express").Router();
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const helpers = require("../../helpers/admin");

//Postagem
router.get("/newPost", helpers.eAdmin, (req, res) => {
    res.render("newPost");
});

router.post("/addPost", helpers.eAdmin, (req, res) => {
    const newPost = {
        title: req.body.title,
        content: req.body.content,
        authorId: req.user.id,
        authorName: req.user.displayName,
    };

    new Post(newPost)
        .save()
        .then(() => {
            req.flash("success", "Postagerm criada com sucesso");
            res.redirect("/");
        })
        .catch((err) => {
            req.flash("error", "Houve um erro na criação da postagem");
            res.redirect("/");
        });
});
//Deletar postagem
router.get(
    "/deletePost/:id",
    helpers.eAdmin,
    helpers.checkPostOwnership,
    (req, res) => {
        Post.deleteMany({ _id: req.params.id })
            .then(() => {
                Comment.deleteMany({ postId: req.params.id }).then(() => {
                    req.flash("success", "Postagem deletada com sucesso!");
                    res.redirect("/");
                });
            })
            .catch((err) => {
                req.flash("error", "Erro interno ao tentar deletar postagem");
                res.redirect("/");
            });
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
    Post.findOne({ _id: req.body.id })
        .then((post) => {
            post.title = req.body.title;
            post.subTitle = req.body.subTitle;
            post.description = req.body.description;
            post.content = req.body.content;

            post.save()
                .then(() => {
                    req.flash("success", "Postagem editada com sucesso!");
                    res.redirect("/");
                })
                .catch((err) => {
                    req.flash("error", "Erro interno");
                    res.redirect("/");
                });
        })
        .catch((err) => {
            req.flash(
                "error",
                "Ocorreu um erro ao salvar as alterações na edição da postagem"
            );
            res.redirect("/");
        });
});

module.exports = router;
