const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser((user, done) => {

});

passport.deserializeUser((id, done) => {

});


passport.use('local-login', new LocalStrategy({
    usernameFiled: "username",
    passwordField: "password",
    passReqToCallback: true
}, (req, username, password, done) => {

}));


module.exports = passport;