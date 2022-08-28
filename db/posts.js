const Post = require("../models/Post");

const postsDB = {
    insertPost: (post) => {
        return new Promise((resolve, reject) => {
            Post.create(post, function (err, post) {
                if (err) {
                    reject(err);
                } else {
                    post.save();
                    resolve(post);
                }
            });
        })
            .then((post) => {
                return post;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    getAllPosts: () => {
        return new Promise((resolve, reject) => {
            Post.find({}, function (err, posts) {
                if (err) {
                    reject(err);
                } else {
                    resolve(posts);
                }
            }).sort({ createdAt: -1 });
        })
            .then((posts) => {
                return posts;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    getPostById: (id) => {
        return new Promise((resolve, reject) => {
            Post.findById(id, function (err, post) {
                if (err) {
                    reject(err);
                } else {
                    resolve(post);
                }
            });
        })
            .then((post) => {
                return post;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    getAllPostsUser: (id) => {
        return new Promise((resolve, reject) => {
            Post.find({ authorId: id }, function (err, posts) {
                if (err) {
                    reject(err);
                } else {
                    resolve(posts);
                }
            });
        })
            .then((posts) => {
                return posts;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    updatePost: (id, content, title) => {
        return new Promise((resolve, reject) => {
            Post.findByIdAndUpdate(
                id,
                { title: title, content: content },
                function (err, post) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(post);
                    }
                }
            );
        })
            .then((post) => {
                return post;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    deletePost: (id) => {
        return new Promise((resolve, reject) => {
            Post.findByIdAndDelete(id, function (err) {
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

    deletePostsUser: (id) => {
        return new Promise((resolve, reject) => {
            Post.deleteMany({ authorId: id }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            }).sort({ createdAt: -1 });
        })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },
};

module.exports = postsDB;
