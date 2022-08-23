require("dotenv").config();
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
require("./config/auth")(passport);

const routes = require("./routes/routes");
const routesComments = require("./routes/comments");

const app = express();
mongoose.connect("mongodb://localhost/forum-api-new");

app.set("port", process.env.PORT || 3001);

// Handlebars (Template-Engine)
app.engine(
    "hbs",
    handlebars.engine({
        defaultLayout: "main",
        extname: ".hbs",
        helpers: require("./helpers/admin.js"),
    })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//Sessão
app.use(
    session({
        secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use(routes);
app.use(routesComments);

//porta de acesso
app.listen(app.get("port"), () => {
    console.log("Server started on port " + app.get("port"));
});
