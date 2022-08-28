const Comment = require("../models/Comment");

const commentsDB = {
    insertComment: (comment) => {
        return new Promise((resolve, reject) => {
            Comment.create(comment, function (err, comment) {
                if (err) {
                    reject(err);
                } else {
                    comment.save();
                    resolve(comment);
                }
            });
        })
            .then((comment) => {
                return comment;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    getCommentById: (id) => {
        Comment.findById(id, function (err, comment) {
            if (err) {
                console.log(err);
                return err;
            } else {
                return comment;
            }
        });
    },

    deleteComment: (id) => {
        return new Promise((resolve, reject) => {
            Comment.findByIdAndDelete(id, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    deleteCommentsPost: (id) => {
        return new Promise((resolve, reject) => {
            Comment.deleteMany({ postId: id }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    deleteCommentsUser: (id) => {
        return new Promise((resolve, reject) => {
            Comment.deleteMany({ authorId: id }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    updateComment: (id, content) => {
        return new Promise((resolve, reject) => {
            Comment.findByIdAndUpdate(id, { content: content }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    getAllCommentsUser: (id) => {
        return new Promise((resolve, reject) => {
            Comment.find({ authorId: id }, function (err, comments) {
                if (err) {
                    reject(err);
                } else {
                    resolve(comments);
                }
            });
        })
            .then((comments) => {
                return comments;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },
};

module.exports = commentsDB;
