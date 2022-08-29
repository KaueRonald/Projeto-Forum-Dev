const User = require("../models/User");
const bcrypt = require("bcrypt");

const userDB = {
    createUser: (user) => {
        return new Promise((resolve, reject) => {
            User.create(user, function (err, user) {
                if (err) {
                    reject(err);
                } else {
                    user.save();
                    resolve(user);
                }
            });
        })
            .then((user) => {
                return user;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            User.findByIdAndRemove(id, function (err) {
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

    updateUser: (id, user, img) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) {
                        req.flash("error", "Erro ao criar usuário.");
                        res.redirect("/");
                    } else {
                        User.findByIdAndUpdate(
                            id,
                            {
                                displayName: user.displayName,
                                email: user.email,
                                password: hash,
                                bio: user.bio,
                                img: img,
                            },
                            function (err) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(true);
                                }
                            }
                        );
                    }
                });
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

    getUser: (id) => {
        return new Promise((resolve, reject) => {
            User.findById(id, function (err, user) {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            }).lean();
        })
            .then((user) => {
                return user;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },

    getUserEmail: (email) => {
        return new Promise((resolve, reject) => {
            User.findOne({ email: email }, function (err, user) {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            }).lean();
        })
            .then((user) => {
                return user;
            })
            .catch((err) => {
                console.log("error: " + err);
                return err;
            });
    },
};

module.exports = userDB;
