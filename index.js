// CONFIG
require("dotenv").config();
require("./database.js");
require("./passport.js")

//requirements
const express = require("express");
const hbars = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const passport = require('passport');

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
const UsersModel = require("./models/UsersModels.js");

const authRoute = require("./routes/authRoute.js");

// APP INIT
const app = express();

// VIEW ENGINE
app.engine("hbs", hbars.engine({ extname: "hbs", defaultLayout: "main" }));

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
  } else {
    res.locals.loginInfo = "not logged in";
  }
  next();
});

// google auth
app.use((req, res, next) => {
  const{ token } = req.cookies

  if (token && jwt.verify(token, process.env.JWT_SECRET)) {
    const tokenData = jwt.decode(token, process.env.JWT_SECRET)
    res.locals.loginInfo = tokenData.username + " " + tokenData.id
  }
  else {
    res.locals.loginInfo = "not logged in"
  }

  next()
})

app.get("/", (req, res) => {
  res.render("home");
});

// THIRD-PARTY LOGIN
app.get('/failed', (req, res) => {
  res.send("Failed")
})

app.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

app.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/failed',
  }),
  async (req, res) => {
    //login to google succesful
    UsersModel.findOne({ googleId: req.user.id }, async (err, user) => {
      const userData = { username: req.user.username }

      if (user) {
        userData.id = user._id
      }
      else {
        const newUser = new UsersModel({ googleId: req.user.id, username: req.user.username })
        const result = await newUser.save()
        userData.id = result._id
      }

      const accessToken = jwt.sign(userData, process.env.JWT_SECRET)

      res.cookie("token", accessToken)
      res.redirect('/')
    })
  }  
)




// ROUTES
app.use("/admin", adminsRoute);
app.use("/profiles", profilesRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/main", mainRoute);
app.use("/front-page", frontPageRoute);
app.use("/film-list", filmListRoute);

app.use("/google-auth", authRoute);

// ERROR ROUTE
app.use("*", errorRoute);

// LISTENING PORT
app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
