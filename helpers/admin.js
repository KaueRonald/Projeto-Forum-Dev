const Post = require("../models/Post");
const Comment = require("../models/Comment");

const helpers = {
    eAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash(
            "error",
            "Você precisa estar logado para fazer isso!"
        );
        res.redirect("/");
    },
    getDisplayName: (user) => {
        return user.displayName;
    },
    getUserBio: (user) => {
        return user.bio;
    },
    getUserEmail: (user) => {
        return user.email;
    },
    getUserId: (user) => {
        return user._id;
    },
    getContent: (comment) => {
        return comment.content;
    },
    getCommentId: (comment) => {
        return comment._id;
    },
    checkCommentOwnership: function (req, res, next) {
        if (req.isAuthenticated()) {
            Comment.findById(req.params._id, function (err, foundComment) {
                if (err || !foundComment) {
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                } else {
                    if (foundComment.authorId == req.user.id) {
                        next();
                    } else {
                        req.flash(
                            "error",
                            "Você não tem permissão para fazer isso"
                        );
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "Você precisa estar logado para fazer isso!");
            res.redirect("back");
        }
    },
    checkPostOwnership: function (req, res, next) {
        if (req.isAuthenticated()) {
            Post.findById(req.params._id, function (err, foundPost) {
                if (err || !foundPost) {
                    req.flash("error", "Você só pode alterar suas postagens");
                    res.redirect("back");
                } else {
                    if (foundPost.authorId == req.user.id) {
                        next();
                    } else {
                        req.flash(
                            "error",
                            "Você não tem permissão para fazer isso"
                        );
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "Você precisa estar logado para fazer isso!");
            res.redirect("back");
        }
    },
};

module.exports = helpers;
