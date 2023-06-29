const express = require('express');
require('dotenv').config();
const app = express();

const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const db = require("./models/database");
const local = require('./strategies/local');
const allowedOrigin = require('./utils/allowedOrigin');
const GoogleSetup = require('./strategies/google_setup');

//storing session
const mysqlStore = require("express-mysql-session")(session);

const options = {
    connectionLimit: 10,
    host: process.env.HOST_NAME,
    user: "admin",
    password: process.env.HOST_KEY,
    database: process.env.HOST_DBNAME,
    port: process.env.PORT,
    createDatabaseTable: true,
    endConnectionOnClose: false,
    clearExpired: true,
    checkExpirationInterval: 60 * 60 * 24,
    expiration: 14400000
}

const sessionStore = new mysqlStore(options, db.promise());

//middlewares to parse info from site
app.use(cors(
    {
        credentials: true,
        origin: true
    }
));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("trust proxy", 1);
app.use(session(
    {
        secret: "Cookie_Secret",
        resave: true,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
          sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
          secure: process.env.NODE_ENV === "production", 
        }
    }
));

app.use(passport.initialize());
app.use(passport.session());



//ROUTERS
const signupRouter = require('./routes/signup.js');
const loginRouter = require('./routes/login');
const authRouter = require('./routes/auth');
const googleRouter = require('./routes/google_auth');
const profileRouter = require('./routes/profile');
const detaRouter = require('./routes/DETA/detaStorage');
const testRouter = require('./routes/testdb');
const logoutRouter = require("./routes/logout");
const programRouter = require("./routes/Program");
const resetRouter = require('./routes/resetpassword');
const forgotRouter = require('./routes/forgotpassword');
const courseRouter = require('./routes/course');
const searchRouter = require('./routes/search');
const changeRouter = require('./routes/changeUserDetails');
const adminRouter = require('./routes/ADMIN/admin');
const booksRouter = require('./routes/recommended_books');
const deleteAccountRouter = require('./routes/deleteAccount');
const recommendedRouter = require('./routes/recommendedCourses');
const videoRouter = require('./routes/videos');
const forumRouter = require('./routes/forum');
const tutorRouter = require('./routes/Tutor')
const allRouter = require('./routes/allCourses')


app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/api/auth", googleRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/deta", detaRouter);
app.use("/testdb", testRouter);
app.use("/logout", logoutRouter);
app.use("/program", programRouter);
app.use("/reset", resetRouter);
app.use("/forgot", forgotRouter);
app.use("/course", courseRouter);
app.use("/search", searchRouter);
app.use("/settings", changeRouter);
app.use("/admin", adminRouter);
app.use("/books", booksRouter);
app.use("/delete", deleteAccountRouter);
app.use("/forum", forumRouter);
app.use("/recommend", recommendedRouter);
app.use('/videos', videoRouter);
app.use('/tutor', tutorRouter);
app.use('/all', allRouter);



const port = process.env.PORT || 3500;
app.listen(port, () => { console.log(`server is running on port ${port}`) });