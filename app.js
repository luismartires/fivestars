require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const helpers = require('handlebars-helpers');

hbs.registerHelper(helpers());
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET, //this string (doesnt matter the name) exists that it will get encrypted by the session, that's how it works
    cookie: {
      sameSite: true,
      httpOnly: true,
      maxAge: 60000,
    },
    rolling: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24, //1 day
    }),
  })
);

// Express View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Connect Routes - Middleware

const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/", auth);

const object = require("./routes/object");
app.use("/", object);

const movies = require("./routes/movies");
app.use("/", movies);

const games = require("./routes/games");
app.use("/", games);

const series = require("./routes/series");
app.use("/", series);

module.exports = app;
