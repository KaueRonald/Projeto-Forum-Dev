const router = require("express").Router();
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const helpers = require("../../helpers/admin");

const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const User = require("../../models/User");
const profileController = require("../../controllers/profile/profile.controller");

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/uploads/"));
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
        profileController.editProfile(req, res);
    }
);

module.exports = router;
