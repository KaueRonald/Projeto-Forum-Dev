const router = require("express").Router();
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const helpers = require("../../helpers/admin");
const commentsController = require("../../controllers/comments/comments.controller");

// Criar comentario
router.post("/addcomment", helpers.eAdmin, function (req, res) {
    commentsController.addComment(req, res);
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
        commentsController.editComment(req, res);
    }
);

// DELETE
router.get(
    "/commentsExcluir/:_id",
    helpers.checkCommentOwnership,
    (req, res) => {
        commentsController.deleteComment(req, res);
    }
);

module.exports = router;
