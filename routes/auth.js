const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models/database')


router.use((request, response, next) => {
    console.log({ "authentication": request.sessionID });
    if (request.user) next()
    else {
        return response.status(401).send({ "message": "Error with authentication" })
    }
})


// creating the routes for the end point
router.get('/', async (request, response) => {
    const { email } = request.user;
    const sql = 'SELECT * FROM student WHERE email = ?'
    const user_details = await db.promise().query(sql, [email]);
    let user = user_details[0][0];
    console.log(user);
    return response.send(user);
})

router.get('/admin', async (request, response) => {
    const { username } = request.user;
    const sql = 'SELECT * FROM admin WHERE username = ?'
    const user_details = await db.promise().query(sql, [username]);
    let user = user_details[0][0];
    console.log(user);
    return response.send(user);
})
module.exports = router