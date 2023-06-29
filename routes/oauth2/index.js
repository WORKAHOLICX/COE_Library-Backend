const express=require('express');
const passport=require('passport');
require('./model/database')
const authRoute=require('./routes/auth')
const GoogleSetup=require('./Strategies/google_setup');
const session = require('express-session')
const app=express();
app.set('view engine', 'ejs')


app.get('/',(req,res)=>{
    res.status(201)
    res.render('pages/home');
})
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'SECRET' 
  }))

app.use(passport.initialize());
app.use(passport.session());


 app.use('/api/auth', authRoute)

 app.listen(3500,()=>{ console.log(` i am listening to port ${3500}`)});