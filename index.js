// CONFIG
require("dotenv").config();
require("./database.js");

//requirements
const express = require("express");
const hbars = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// UTILS
const utils = require("./utils/utils.js");

//route requirements
const adminsRoute = require("./routes/adminsRoute");
const errorRoute = require("./routes/errorRoute");
const profilesRoute = require("./routes/profilesRoute");
const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");
const mainRoute = require("./routes/mainRoute.js");
const frontPageRoute = require("./routes/front-pageRoute");
const filmListRoute = require("./routes/film-listRoute");
const reviewsRoute = require("./routes/reviewsRoute");

// APP INIT
const app = express();

// VIEW ENGINE
app.engine("hbs", hbars.engine({ extname: "hbs", defaultLayout: "main" }));

app.set("view engine", "hbs");

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(cParser());
app.use(express.static("public"));
app.use(fileUpload());

app.use((req, res, next) => {
	const { token } = req.cookies;

	if (token && jwt.verify(token, process.env.JWT_SECRET)) {
		const tokenData = jwt.decode(token, process.env.JWT_SECRET);
		res.locals.loginInfo =
			tokenData.username + " " + tokenData.userId + " " + tokenData.role;

		console.log(tokenData);
	} else {
		res.locals.loginInfo = "not logged in";
	}
	next();
});

app.get("/", (req, res) => {
	res.render("home");
});

// ROUTES
app.use("/admin", adminsRoute);
app.use("/profiles", profilesRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/main", mainRoute);
app.use("/front-page", frontPageRoute);
app.use("/film-list", filmListRoute);
app.use("/reviews", reviewsRoute);

// ERROR ROUTE
app.use("*", errorRoute);

// LISTENING PORT
app.listen(8000, () => {
	console.log("http://localhost:8000/");
});
