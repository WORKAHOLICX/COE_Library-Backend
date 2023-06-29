const localStrategy = require("passport-local");
const passport = require("passport");
const db = require("../models/database");
const { comparepassword } = require("../utils/helper");



passport.serializeUser((user, done) => {
    console.log("Serializing...");
    done(null, user.email);
});


passport.deserializeUser(async (email, done) => {
    console.log("...deserializing");
    try {
        const result = await db.promise().query(`SELECT * FROM student WHERE email = ?`, email)
        if (result[0][0]) {
            done(null, result[0][0]);
        }
    }
    catch (error) {
        done(error, null);
    }
});

passport.use(new localStrategy(
    {
        userNameField: "username",
        passwordField: "password"
    },
    async (username, password, done) => {
        try {
            if (!username || !password) {
                done()
            }
            const result = await db.promise().query("SELECT * FROM student WHERE username = ?", username)
            if (result[0].length == 0) {
                done(null, false);
            }
            else {
                const user = result[0][0]
                const isvalid = comparepassword(password, user.password)
                if (isvalid) {
                    console.log("sucessful authentication")
                    done(null, user);
                }
                else {
                    console.log("authentication failed");
                    done(null, false)
                }
            }
        }
        catch (error) {
            done(error, false);
        }
    }
));