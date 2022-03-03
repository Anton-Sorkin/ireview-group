// CONFIG
require("dotenv").config();
require("./database.js");

//requirements
const express = require("express");
const hbars = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cParser = require("cookie-parser");

// UTILS
const utils = require("./utils/utils.js");

//route requirements
const adminsRoute = require("./routes/adminsRoute");
const errorRoute = require("./routes/errorRoute");
const profilesRoute = require("./routes/profilesRoute");
const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");

// APP INIT
const app = express();

// VIEW ENGINE
app.engine("hbs", hbars.engine({ extname: "hbs", defaultLayout: "main" }));

app.set("view engine", "hbs");

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(cParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("home");
});

// ROUTES
app.use("/admin", adminsRoute);
app.use("/profiles", profilesRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);

// ERROR ROUTE
app.use("*", errorRoute);

// LISTENING PORT
app.listen(8000, () => {
	console.log("http://localhost:8000/");
});
