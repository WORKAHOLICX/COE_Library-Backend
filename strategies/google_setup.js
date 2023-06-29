
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const db = require('../models/database')



passport.serializeUser((user, done) => {
  console.log("Serializing...");
  done(null, user.username);
});


passport.deserializeUser(async (username, done) => {
  console.log("...deserializing");

  try {
    const result = await db.promise()
      .query(`SELECT * FROM student WHERE username = ?`, username)

    if (result[0][0]) {
      done(null, result[0][0]);
    }
  }
  catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy({
    callbackURL: 'https://evening-springs-84078.herokuapp.com/api/auth/google/callback',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    proxy: true
  },

    async (accessToken, refreshToken, profile, done) => {
      try {
        process.nextTick(async function () {
          const result = await db.promise()
            .query("SELECT * FROM student WHERE googleId = ?", [profile.id],
              (err, user) => {
                if (err) {
                  return done(err);
                }
              })
          //....................................

          let user = result[0][0]
          if (user) {
            return done(null, user);
          }
          else {
            let newUser = {
              googleId: profile.id,
              email: profile.emails[0].value
            };

            await db.promise()
              .query("UPDATE student SET googleId = ? where email = ?",
                [newUser.googleId, newUser.email])
            const res = await db.promise()
              .query("SELECT * FROM student WHERE email = ?",
                [newUser.email])
            newUser = res[0][0]
            return done(null, newUser);

          }
        })
      }
      catch (error) {
        done(error, false);
      }

    })
)


