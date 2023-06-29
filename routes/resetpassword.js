const express = require("express");
const router = express.Router();
const db = require('../models/database')
const { hashpassword } = require("../utils/helper")

router.post('/', async function (request, response) {
    const { token } = request.query;
    // return response.send(token)
    let sql = 'SELECT * FROM password_token WHERE TOKEN = ?'
    const result = await db.promise().query(sql, [token])

    if (result[0] == "") {
        return response.status(401).send({ msg: "Invalid Token" })
    }


    const { email } = result[0][0];
    console.log(email);
    const password = hashpassword(request.body.password)
    sql = "UPDATE student SET password = ? WHERE email = ?"
    await db.promise().query(sql, [password, email])
    return response.status(200).send({ msg: "Password changed" })




})

module.exports = router