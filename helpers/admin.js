const Post = require("../models/Post");
const Comment = require("../models/Comment");

const helpers = {
    eAdmin: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash(
            "error",
            "Você precisa estar logado para acessar essa página!"
        );
        res.redirect("/");
    },
    getDisplayName: (user) => {
        return user.displayName;
    },
    getUserId: (currentUser) => {
        return currentUser._id;
    },
    getPostmatch: (posts, postId) => {
        console.log(posts);
    },
    getContent: (comment) => {
        return comment.content;
    },
    getCommentId: (comment) => {
        return comment._id;
    },
    checkCommentOwnership: function (req, res, next) {
        // Is user logged in?
        if (req.isAuthenticated()) {
            Comment.findById(req.params._id, function (err, foundComment) {
                if (err || !foundComment) {
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                } else {
                    // Does user own the comment?
                    if (foundComment.authorId == req.user.id) {
                        next();
                    } else {
                        req.flash(
                            "error",
                            "You don't have permission to do that"
                        );
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You must be logged in to do that");
            res.redirect("back");
        }
    },
};

module.exports = helpers;
