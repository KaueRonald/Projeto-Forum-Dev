const commentsDB = require("../../db/comment");
const postsDB = require("../../db/posts");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");

const commentsController = {
    // Add new comment
    addComment: (req, res) => {
        postsDB
            .getPostById(req.body.post_id)
            .then((post) => {
                if (post) {
                    const comment = {
                        content: req.body.comment,
                        postId: req.body.post_id,
                        authorId: req.user.id,
                        authorName: req.user.displayName,
                    };
                    commentsDB.insertComment(comment).then((comment) => {
                        post.comments.push(comment);
                        post.save();
                        res.redirect("/postContent/" + req.body.post_id);
                    });
                } else {
                    req.flash("error", "Postagem não encontrada");
                    res.redirect("/postContent/" + req.body.post_id);
                }
            })
            .catch((err) => {
                console.log(err);
                res.redirect("/postContent/" + req.body.post_id);
            });
    },

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
        commentsDB
            .updateComment(req.params._id, req.body.content)
            .then((result) => {
                res.redirect("/postContent/" + req.body.post_id);
            })
            .catch((err) => {
                console.log("error: " + err);
                res.redirect("/postContent/" + req.body.post_id);
            });
    },

    // Delete comment
    deleteComment: (req, res) => {
        commentsDB.deleteComment(req.params._id).then((result) => {
            if (result) {
                req.flash("success", "Comentário excluído com sucesso!");
                res.redirect("back");
            } else {
                req.flash("error", "Erro interno");
                res.redirect("back");
            }
        });
    },
};

module.exports = commentsController;
