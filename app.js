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
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger.json");
const db = require("./config/db");
require("./config/auth")(passport);

const routes = require("./routes/routes");
const routesComments = require("./routes/comments/comments");
const routesPosts = require("./routes/posts/posts");
const routesUsers = require("./routes/users/users");

const app = express();
mongoose.connect(db.mongoURI);

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

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use(routes);
app.use(routesComments);
app.use(routesPosts);
app.use(routesUsers);

//porta de acesso
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});
