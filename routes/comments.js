const express = require("express");
const router = require("express").Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const helpers = require("../helpers/admin");

// Criar comentario
router.post("/addcomment", helpers.eAdmin, function (req, res) {
    Post.findById(req.body.post_id, function (err, post) {
        if (err) {
            console.log(err);
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
                    req.flash("error_msg", "Seu comentário não foi salvo");
                    res.redirect("/postContent/" + req.body.post_id);
                } else {
                    // Save comment, add to post, and save post
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    req.flash(
                        "success",
                        "Your comment was successfully created!"
                    );
                    res.redirect("/postContent/" + req.body.post_id);
                }
            });
        }
    });
});

// EDIT
router.get(
    "/commentsEdit/:_id",
    helpers.checkCommentOwnership,
    function (req, res) {
        Comment.findById(req.params._id, function (err, comments) {
            if (err) {
                res.redirect("back");
            } else {
                res.render("commentsEdit", { comments: comments });
            }
        });
    }
);

router.post(
    "/commentsEdit/:_id",
    helpers.checkCommentOwnership,
    function (req, res) {
        Comment.findById(req.body._id)
            .then((comment) => {
                console.log(comment);
                comment.content = req.body.content;
                comment
                    .save()
                    .then(() => {
                        req.flash(
                            "success_msg",
                            "Comentário editado com sucesso!"
                        );
                        res.redirect("/");
                    })
                    .catch((err) => {
                        req.flash("error_msg", "Erro interno");
                        console.log("error: " + err);
                        res.redirect("/");
                    });
            })
            .catch((err) => {
                req.flash(
                    "error_msg",
                    "Ocorreu um erro ao salvar as alterações na edição da postagem"
                );
                console.log(err);
                res.redirect("/");
            });
    }
);

// DELETE
router.get(
    "/commentsExcluir/:_id",
    helpers.checkCommentOwnership,
    (req, res) => {
        Comment.deleteMany({ _id: req.params._id })
            .then(() => {
                req.flash("success_msg", "Postagem deletada com sucesso!");
                res.redirect("/");
            })
            .catch((err) => {
                req.flash(
                    "error_msg",
                    "Erro interno ao tentar deletar postagem"
                );
                res.redirect("/");
            });
    }
);

module.exports = router;
