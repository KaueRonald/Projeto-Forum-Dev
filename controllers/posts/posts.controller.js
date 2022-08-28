const postsDB = require("../../db/posts");
const commentsDB = require("../../db/comment");

const postsController = {
    // Add new post
    addPost: (req, res) => {
        const newPost = {
            title: req.body.title,
            content: req.body.content,
            authorId: req.user.id,
            authorName: req.user.displayName,
        };

        postsDB
            .insertPost(newPost)
            .then((post) => {
                res.redirect("/postContent/" + post._id);
            })
            .catch((err) => {
                console.log("error: " + err);
                res.redirect("back");
            });
    },

    // Edit post
    editPost: (req, res) => {
        postsDB
            .updatePost(req.body.id, req.body.content, req.body.title)
            .then((result) => {
                req.flash("success", "Post editado com sucesso!");
                res.redirect("/postContent/" + req.params._id);
            })
            .catch((err) => {
                console.log("error: " + err);
                req.flash("error", "Erro ao editar postagem");
                res.redirect("back");
            });
    },

    // Delete post
    deletePost: (req, res) => {
        postsDB.deletePost(req.params.id).then((result) => {
            if (result) {
                commentsDB.deleteCommentsPost(req.params.id).then((result) => {
                    if (result) {
                        req.flash("success", "Postagem excluída com sucesso!");
                        res.redirect("/");
                    } else {
                        req.flash("error", "Erro ao excluir comentários");
                        res.redirect("back");
                    }
                });
            } else {
                req.flash("error", "A postagem não foi excluída");
                res.redirect("back");
            }
        });
    },
};

module.exports = postsController;
