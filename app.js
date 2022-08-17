require("dotenv").config();
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
require("./config/auth")(passport)

const routes = require("./routes/routes");

const app = express();
mongoose.connect("mongodb://localhost/forum-api");

app.set("port", process.env.PORT || 3000);

// Handlebars (Template-Engine)
app.engine(
  "hbs",
  handlebars.engine({ defaultLayout: "main", extname: ".hbs" })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Sessão
app.use(
  session({
    secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
    resave: false,
    saveUninitialized: true,
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(routes);

//porta de acesso
app.listen(app.get("port"), () => {
  console.log("Server started on port " + app.get("port"));
});
