
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const db = require('../model/database')



passport.serializeUser((user, done) => {
  console.log("...Serializing");
  done(null, user);
});

passport.deserializeUser((req, user, done) => {
  db.query("SELECT * FROM student WHERE  googleId=?",
    [
      user.googleId], (err, rows) => {
        if (err) {
          console.log(err);
          return done(null, err);
        }
        done(null, user);
      });
  console.log("Deserializing....");
});



passport.use(
  new GoogleStrategy({
    callbackURL: 'https://evening-springs-84078.herokuapp.com/api/auth/google/callback',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, async (accessToken, refreshToken, profile, done) => {
    process.nextTick(async function () {
      const result = await db.promise().query("SELECT * FROM student WHERE googleId = ?",
        [profile.id], (err, user) => {
          if (err) {
            return done(err);
          }
        })
      //....................................
      let user = result[0][0]
      if (user) {
        return done(null, user);
      } else {
        let newUser = {
          googleId: profile.id,
          email: profile.emails[0].value
        };
        console.log(newUser);
        db.query("UPDATE student SET googleId =? where email = ?",
          [newUser.googleId, newUser.email], (err, rows) => {
            if (err) {
              console.log(err);
            }
            return done(null, newUser);
          })
      }

    })
  })
)


