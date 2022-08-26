const Comment = require("../../models/Comment");
const Post = require("../../models/Post");

const commentsController = {
    // Add new comment
    addComment: (req, res) => {
        Post.findById(req.body.post_id, function (err, post) {
            if (err) {
                res.redirect("/postContent/" + req.body.post_id);
            } else {
                const comment = {
                    content: req.body.comment,
                    postId: req.body.post_id,
                    authorId: req.user.id,
                    authorName: req.user.displayName,
                };
                Comment.create(comment, function (err, comment) {
                    if (err) {
                        console.log(err);
                        req.flash("error", "Seu comentário não foi salvo");
                        res.redirect("/postContent/" + req.body.post_id);
                    } else {
                        comment.save();
                        post.comments.push(comment);
                        post.save();
                        req.flash(
                            "success",
                            "Seu comentário foi criado com sucesso!"
                        );
                        res.redirect("/postContent/" + req.body.post_id);
                    }
                });
            }
        });
    },

    // Edit comment
    editComment: (req, res) => {
        Comment.findById(req.body._id, function (err, comments) {
            if (err) {
                res.redirect("back");
            } else {
                comments.content = req.body.content;
                comments
                    .save()
                    .then(() => {
                        req.flash("success", "Comentário editado com sucesso!");
                        res.redirect("/");
                    })
                    .catch((err) => {
                        req.flash("error", "Erro interno");
                        console.log("error: " + err);
                        res.redirect("/");
                    });
            }
        });
    },

    // Delete comment
    deleteComment: (req, res) => {
        Comment.deleteMany({ _id: req.params._id }, (err) => {
            if (err) {
                console.log(err);
                req.flash("error", "Seu comentário não foi deletado");
                res.redirect("/postContent/" + req.body.post_id);
            } else {
                req.flash("success", "Seu comentário foi deletado");
                res.redirect("/postContent/" + req.body.post_id);
            }
        });
    },
};

module.exports = commentsController;
