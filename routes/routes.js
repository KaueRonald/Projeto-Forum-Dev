const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const passport = require("passport")
const {eAdmin} = require("../helpers/admin")

router.get("/", function (req, res) {

  Post.find().lean().sort({data:"desc"}).then((users)=>{
    res.render('home', {users: users});
  }).catch((err)=>{
    req.flash('error_msg', 'Houve um erro interno!')
    res.redirect('/404')
  })
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/profile", eAdmin, function (req, res) {
  res.render("profile");
});

router.get("/signup", function (req, res) {
  res.render("signup");
});

router.post("/login", function (req, res, next) {

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next)

});

router.get("/logout", function (req, res)  {
  req.logout(function(err) {
    req.flash("success_msg", "Deslogado com sucesso!")
    if (err) { return next(err); }
    
    res.redirect('/');
  });
})

router.post("/signup", function (req, res) {
  let errs = [];

  const email = req.body.email;
  const displayName = req.body.displayName;
  const password = req.body.password;
  const password2 = req.body.password2;

  if (!email || typeof email == undefined || email == null) {
    errs.push({ text: "Email invalido" });
  }

  if (!password || typeof password == undefined || password == null) {
    errs.push({ text: "Password invalido." });
  }

  if (password.length < 8) {
    errs.push({ text: "Password tem que ter no mínimo 8 caracteres." });
  }

  if (password != password2) {
    errs.push({ text: "Os password são diferente." });
  }

  if (errs.length > 0) {
    res.render("signup", { errs: errs });
  } else {
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          req.flash("error_msg", "Email já cadastrado.");
          res.redirect("/signup");
        } else {
          const newUser = new User({
            displayName: displayName,
            email: email,
            password: password,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                req.flash("error_msg", "Erro ao criar usuário.");
                res.redirect("/");
              }

              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash("success_msg", "Usuário criado com sucesso.");
                  res.redirect("/");
                })
                .catch((err) => {
                  req.flash(
                    "error_msg",
                    "Erro ao criar usuário, tente novamente."
                  );
                  res.redirect("/signup");
                });
            });
          });
        }
      })
      .catch((err) => {
        req.flash("error_msg", "Erro ao cadastrar usuário.");
        res.redirect("/");
      });
  }
});

router.get('/newPost', eAdmin, (req, res)=>{
  res.render('newPost');
})

router.post('/addPost', eAdmin, (req, res)=>{
  const newPost = {
    title: req.body.title,
    subTitle: req.body.subTitle,
    description: req.body.description,
    content: req.body.content

}

  new Post(newPost).save().then(() => {
      req.flash('success_msg', 'Postagerm criada com sucesso');
      res.redirect('/');
  }).catch((err) => {
      req.flash('error_msg', 'Houve um erro na criação da postagem')
      res.redirect('/');
  })
})

router.get('/postContent/:id', (req, res)=>{
  Post.findOne({_id:req.params.id}).lean().then((post)=>{
    res.render('postContent', {post:post});
  }).catch((err)=>{
    req.flash('error_msg', 'Ocorreu um erro interno');
    res.redirect('/');
  })
})

router.get('/deletePost/:id', eAdmin, (req, res)=>{
  Post.deleteMany({_id: req.params.id}).then(()=>{
    req.flash('success_msg', 'Postagem deletada com sucesso!')
    res.redirect('/')
  }).catch((err)=>{
    req.flash('error_msg', 'Erro interno ao tentar deletar postagem')
    res.redirect('/')
  })
})

router.get('/editPost/:id', eAdmin, (req, res)=>{

  Post.findOne({_id: req.params.id}).lean().then((post) =>{
    res.render('editPost', {post:post});
  }).catch((err)=>{
    req.flash('error_msg', 'Ocorreu um erro interno');
    res.redirect('/');
  })

})

router.post('/editPost', eAdmin, (req, res)=>{

  Post.findOne({_id:req.body.id}).then((post)=>{

    post.title = req.body.title;
    post.subTitle = req.body.subTitle
    post.description = req.body.description;
    post.content = req.body.content;

    post.save().then(() => {
        req.flash('success_msg', 'Postagem editada com sucesso!')
        res.redirect('/')
    }).catch((err)=>{
        req.flash('error_msg', 'Erro interno')
        res.redirect('/');
    })

  }).catch((err)=>{
    req.flash('error_msg', 'Ocorreu um erro ao salvar as alterações na edição da postagem')
    res.redirect('/')
  })

})

module.exports = router;
