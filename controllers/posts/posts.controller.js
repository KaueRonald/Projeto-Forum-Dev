const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

const postsController = {
    // Add new post
    addPost: (req, res) => {
        const newPost = {
            title: req.body.title,
            content: req.body.content,
            authorId: req.user.id,
            authorName: req.user.displayName,
        };

        new Post(newPost)
            .save()
            .then(() => {
                req.flash("success", "Postagem criada com sucesso");
                res.redirect("/");
            })
            .catch((err) => {
                req.flash("error", "Houve um erro na criação da postagem");
                res.redirect("/");
            });
    },

    // Edit post
    editPost: (req, res) => {
        Post.findOne({ _id: req.body.id })
            .then((post) => {
                post.title = req.body.title;
                post.content = req.body.content;

                post.save()
                    .then(() => {
                        req.flash("success", "Postagem editada com sucesso");
                        res.redirect("/");
                    })
                    .catch((err) => {
                        req.flash(
                            "error",
                            "Houve um erro na edição da postagem"
                        );
                        res.redirect("/");
                    });
            })
            .catch((err) => {
                req.flash("error", "Houve um erro na edição da postagem");
                res.redirect("/");
            });
    },

    // Delete post
    deletePost: (req, res) => {
        Post.deleteOne({ _id: req.params.id })
            .then(() => {
                Comment.deleteMany({ postId: req.params.id })
                    .then(() => {
                        req.flash("success", "Postagem deletada com sucesso");
                        res.redirect("/");
                    })
                    .catch((err) => {
                        req.flash("error", "Houve um erro ao deletar postagem");
                        res.redirect("/");
                    }),
                    (err) => {
                        req.flash("error", "Houve um erro ao deletar postagem");
                        res.redirect("/");
                    };
            })
            .catch((err) => {
                req.flash("error", "Houve um erro ao deletar postagem");
                res.redirect("/");
            }),
            (err) => {
                req.flash("error", "Houve um erro ao deletar postagem");
                res.redirect("/");
            };
    },
};

module.exports = postsController;
