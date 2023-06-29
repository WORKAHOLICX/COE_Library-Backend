const db = require('../models/database')
const express = require('express');
const router = express.Router()


router.post('/', async (request, response) => {
    const { fname, gender, occupation, phone, email, region, city, course } = request.body.input;
    
    let sql = 'SELECT * FROM Tutors WHERE email = ?';
    const result = await db.promise().query(sql, [email])
    if (result[0].length == 0) {
        try {
            sql = `INSERT INTO Tutors (fullname, gender, occupation, phone_Number ,email ,region ,city ,course) VALUES (?,?,?,?,?,?,?,?)`
            const results = db.promise().query(sql, [fname, gender, occupation, phone, email, region, city, course])

            response.status(201).send("Tutor created")
        }
        catch (err) {
            console.log(err)
        }
    } else {
        const db_email = result[0][0].Email
        return response.status(409).send({ error_msg: "Email is taken" })
    }

})

router.get('/', async (request, response) => {
    const sql = 'SELECT * FROM Tutors'
    const tutors = await db.promise().query(sql)
    console.log("here");
    response.send(tutors[0])
})

module.exports = router;