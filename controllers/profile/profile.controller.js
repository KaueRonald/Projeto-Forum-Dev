const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const User = require("../../models/User");
const fs = require("fs");
const bcrypt = require("bcrypt");

const profileController = {
    //Edit profile
    editProfile: (req, res) => {
        User.findById(req.params.id)
            .then((updateUser) => {
                const img = fs.readFileSync(
                    "./public/uploads/" + req.file.filename,
                    {
                        encoding: "base64",
                    }
                );
                console.log("depois", img);
                (updateUser.displayName = req.body.displayNome),
                    (updateUser.email = req.body.email),
                    (updateUser.password = req.body.password),
                    (updateUser.bio = req.body.bio),
                    (updateUser.img = img),
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(updateUser.password, salt, (err, hash) => {
                            if (err) {
                                req.flash("error", "Erro ao criar usuário.");
                                res.redirect("/");
                            }
                            updateUser.password = hash;
                            updateUser
                                .save()
                                .then(() => {
                                    Post.find({ authorId: req.params.id }).then(
                                        (posts) => {
                                            for (
                                                let i = 0;
                                                i < posts.length;
                                                i++
                                            ) {
                                                posts[i].authorName =
                                                    updateUser.displayName;
                                                posts[i].save();
                                            }
                                        }
                                    );
                                    req.flash(
                                        "success",
                                        "Usuário editado com sucesso!"
                                    );
                                    res.redirect("/");
                                })
                                .catch((err) => {
                                    req.flash("error", "Erro interno");
                                    res.redirect("/");
                                });
                        });
                    });
            })
            .catch((err) => {
                req.flash(
                    "error",
                    "Ocorreu um erro ao salvar as alterações na edição do usuário"
                );
                res.redirect("/");
            });
    },
};

module.exports = profileController;
