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
const reviewsRoute = require("./routes/reviewsRoute");

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
    res.locals.loginId = tokenData.userId;
    console.log(tokenData);
  } else {
    res.locals.loginInfo = "not logged in";
  }
  next();
});

// google auth - middleware for checking cookie token
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

//skickar tillbaka nyckel - hemlig engångskod - till användaren 
//Verifierar med google, hemliga nycken, klient id, hemliga nyckeln från klienten

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: "/failure" }),
  async (req, res) => {
    //Login with google successful
    console.log(req.user)

    const googleId = req.user.id

    UsersModel.findOne({ googleId }, async (err, user) => {
      const userData = {username: req.user.username}

      if(user) {
        userData.id = user._id
      }
      else{
        const newUser = new UsersModel({
          googleId,
          username: req.user.username
        })
        const result = await newUser.save()

        userData.id = result._id
      }

      //userdata : (googleId, Id)
      // första parametern är datan vi vill signera, andra parametern är vår hemligthet, 

      const token = jwt.sign(userData, process.env.JWT_SECRET)

      // ta token och spara i vår token-cookie
      res.cookie("token", token)

      res.redirect("/")
    })
  }
)

// logout

app.get('/logout', (req, res) => {
  res.cookie("token", "", { maxAge: 0 })
  res.redirect('/')
})

// /THIRD-PARTY LOGIN
// Oavsett om det finns i vår databas eller ej så ska vi ha displayName, det hämtas från Google


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
