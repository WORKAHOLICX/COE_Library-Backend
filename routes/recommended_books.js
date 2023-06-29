const express = require('express');
const router = express.Router();
const db = require('../models/database')

router.get('/:course', async (req, res) => {
    const { course } = req.params
    const sql = `SELECT * FROM CourseBooks WHERE courseName = ?`
    const results = await db.promise().query(sql, [course]);
    const books = results[0]
    console.log("haha");

    return res.send(books)
})


module.exports = router;