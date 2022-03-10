// CONFIG
require("dotenv").config();
require("./database.js");
require("./passport.js");

//requirements
const express = require("express");
const hbars = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const passport = require("passport");

// UTILS
const utils = require("./utils/utils.js");

//route requirements
const adminsRoute = require("./routes/adminsRoute");
const errorRoute = require("./routes/errorRoute");
const profilesRoute = require("./routes/profilesRoute");
const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");
const mainRoute = require("./routes/mainRoute.js");
const reviewsRoute = require("./routes/reviewsRoute");

// USERSMODEL
const UsersModel = require("./models/UsersModels");
const SettingsModel = require("./models/SettingsModels.js");

// APP INIT
const app = express();

// VIEW ENGINE
app.engine(
	"hbs",
	hbars.engine({
		extname: "hbs",
		defaultLayout: "main",
		helpers: {
			checkIfIdsAreSame: (idOne, idTwo) => {
				return idOne.toString() == idTwo.toString();
			},
		},
	})
);

app.set("view engine", "hbs");

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(cParser());
app.use(passport.initialize());
app.use(express.static("public"));
app.use(fileUpload());

app.use((req, res, next) => {
	const { token } = req.cookies;

	if (token && jwt.verify(token, process.env.JWT_SECRET)) {
		const tokenData = jwt.decode(token, process.env.JWT_SECRET);
		res.locals.loginInfo =
			tokenData.username + " " + tokenData.userId + " " + tokenData.role;
		res.locals.loginUser = tokenData.username;
		res.locals.loginId = tokenData.userId;
		res.locals.isLoggedIn = true;
	} else {
		res.locals.loginInfo = "not logged in";
		res.locals.isLoggedIn = false;
	}
	next();
});

app.get("/", (req, res) => {
	res.render("home");
});

// THIRD-PARTY LOGIN
app.get("/failed", (req, res) => {
	res.send("Failed");
});

app.get(
	"/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/failure" }),
	async (req, res) => {
		const googleId = req.user.id;

		UsersModel.findOne({ googleId }, async (err, user) => {
			const userData = {};

			if (user) {
				userData.id = user._id;
				userData.username = user.username;
			} else {
				const newSetting = new SettingsModel({
					favmovie: "",
					quote: "",
					quoteby: "",
				});
				const settingsResult = await newSetting.save();

				const newUser = new UsersModel({
					googleId,
					username: req.user.displayName,
					settings: settingsResult._id,
				});
				const result = await newUser.save();

				userData.id = result._id;
				userData.username = req.user.displayName;
			}

			const token = jwt.sign(userData, process.env.JWT_SECRET);

			res.cookie("token", token);
			console.log(req.user._json);

			res.redirect("/main");
		});
	}
);

// logout

app.get("/logout", (req, res) => {
	res.cookie("token", "", { maxAge: 0 });
	res.redirect("/");
});

// ROUTES
app.use("/admin", adminsRoute);
app.use("/profiles", profilesRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/main", mainRoute);
app.use("/reviews", reviewsRoute);

// ERROR ROUTE
app.use("*", errorRoute);

// LISTENING PORT
app.listen(8000, () => {
	console.log("http://localhost:8000/");
});
