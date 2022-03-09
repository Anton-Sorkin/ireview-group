const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.serializeUser(function (user, done) {
    // Optionally add extra code for verifying user or adding extra attributes
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// PASSPORT SETUP
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // the url google will send the user to when authorized
    //wed 1007 5:20, create new env?
    callbackURL: "http://localhost:8000/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);

    }    
));


// här får vi den req som gogole skicakt till vår callback när vi har loggat in
// skickar in req får en accesstoken och refreshtoken, som är 2 tokens som bekräft att vi är den vi säger att vi är 