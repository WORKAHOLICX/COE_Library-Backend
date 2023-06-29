const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('../models/database')
const { hashpassword } = require("../utils/helper")




router.get('/:user_detail', async (req, res) => {
    const { user_detail } = req.params;
    const sql = "SELECT * FROM student WHERE username = ? OR email =?"
    const result = await db.promise().query(sql, [user_detail, user_detail])
    console.log(result[0]);
    if (result[0] == "") {
        return res.status(200).send({ msg: "Username is free" });
    }
    return res.status(409).send({ msg: `${user_detail} is taken` })


})

router.post('/',
    [check('username')
        .notEmpty(),
    check('password')
        .notEmpty(),
    check('email')
        .isEmail().notEmpty(),
    check('fullname')
        .notEmpty(),
    check('programme')
        .notEmpty(),
    check('year')
        .optional()
    ], async (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return (res.status(201).send("ERROR!"))
        }

        const { username, email, fullname, programme, year } = req.body;
        let sql = 'SELECT * FROM student WHERE username = ? OR email = ?';
        const result = await db.promise().query(sql, [username, email], (error, result, field) => {
            console.log(error);
        })
        console.log("Signup.js");
        if (result[0].length == 0) {
            const password = hashpassword(req.body.password);
            try {
                sql = `INSERT INTO student (username, password, email, fullname, programme, year) VALUES ('${username}','${password}','${email}','${fullname}','${programme}','${year}')`
                db.promise().query(sql)
                res.status(201).send("User created")
            }
            catch (err) {
                console.log(err)
            }
        } else {
            // res.status(400).send({msg:"User already exists"})
            const db_email = result[0][0].email
            const db_username = result[0][0].username

            if (db_email == email && db_username != username) {
                return res.status(409).send({ error_msg: "Email is taken" })
            }
            else if (db_email != email && db_username == username) {
                return res.status(409).send({ error_msg: "Username is taken" })
            }
            else if (db_email == email && db_username == username) {
                return res.status(409).send({ error_msg: "Username and Email have been taken" })
            }

            return res.status(409).send({ error_msg: "Something went wrong" })

        }





    })

module.exports = router;