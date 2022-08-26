const router = require("express").Router();
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const helpers = require("../../helpers/admin");

const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const User = require("../../models/User");

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/uploads/"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

//Perfil
router.get("/profile/:id", (req, res) => {
    Comment.find({ authorId: req.params.id })
        .lean()
        .sort({ data: "desc" })
        .then((comments) => {
            Post.find({ authorId: req.params.id })
                .lean()
                .sort({ data: "desc" })
                .then((posts) => {
                    User.findById(req.params.id)
                        .lean()
                        .then((user) => {
                            let comp;

                            if (req.user) {
                                if (
                                    JSON.stringify(user._id) !==
                                        JSON.stringify(req.user._id) ||
                                    req.user._id === undefined
                                ) {
                                    comp = false;
                                } else {
                                    comp = true;
                                }
                            } else {
                                comp = false;
                            }

                            const img = `data:"image/png";base64,${user.img}`;
                            res.render("profile", {
                                comments: comments,
                                posts: posts,
                                commentsCont: comments.length,
                                postsCont: posts.length,
                                user: user,
                                comp: comp,
                                img: img,
                            });
                        });
                });
        });
});

//Editar Perfil
router.get("/editProfile/:id", helpers.eAdmin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .lean()
        .then((user) => {
            res.render("editProfile", { user: user });
        })
        .catch((err) => {
            req.flash("error", "Ocorreu um erro interno");
            res.redirect("/");
        });
});

//Editar perfil pegando o id
router.post(
    "/editProfile/:id",
    helpers.eAdmin,
    upload.single("imageUser"),
    (req, res) => {
        User.findById(req.params.id)
            .then((updateUser) => {
                const img = fs.readFileSync(
                    "./public/uploads/" + req.file.filename,
                    {
                        encoding: "base64",
                    }
                );

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
    }
);

module.exports = router;
