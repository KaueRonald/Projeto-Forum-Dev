const router = require("express").Router();
const userController = require("../../controllers/user/user.controller");
const passport = require("passport");
const commentsDB = require("../../db/comment");
const userDB = require("../../db/user");
const postDB = require("../../db/posts");
const helpers = require("../../helpers/admin");
const multer = require("multer");
const path = require("path");

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

//renderização da página de Login
router.get("/login", function (req, res) {
    res.render("login");
});
//Login
router.post("/login", function (req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })(req, res, next);
});

//Cadastro
router.get("/signup", function (req, res) {
    res.render("signup");
});
//Rota post de Cadastro
router.post("/signup", function (req, res) {
    userController.createUser(req, res);
});

//Sair
router.get("/logout", function (req, res) {
    req.logout(function (err) {
        req.flash("success", "Deslogado com sucesso!");
        if (err) {
            return next(err);
        }

        res.redirect("/");
    });
});

//Delete user
router.post("/deleteUser/:id", function (req, res) {
    res.locals.currentUser.checkPassword(
        req.body.password,
        async (err, isMatch) => {
            if (err) {
                return next(err);
            }
            if (isMatch) {
                userController.deleteUser(req, res);
            }
        }
    );
});

//Renderização da página do perfil
router.get("/profile/:id", function (req, res) {
    commentsDB
        .getAllCommentsUser(req.params.id)
        .then((comments) => {
            postDB
                .getAllPostsUser(req.params.id)
                .then((posts) => {
                    userDB
                        .getUser(req.params.id)
                        .then((user) => {
                            let comp;

                            if (req.user) {
                                if (
                                    JSON.stringify(req.params.id) !==
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
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

//Render Editar Perfil
router.get("/editProfile/:id", helpers.eAdmin, (req, res) => {
    userController.getUserById(req, res);
});

//Editar perfil pegando o id
router.post(
    "/editProfile/:id",
    helpers.eAdmin,
    upload.single("imageUser"),
    (req, res) => {
        userController.updateUser(req, res);
    }
);
module.exports = router;
