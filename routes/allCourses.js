const express = require('express')
const router = express.Router()
const db = require('../models/database')


router.get('/', async(request, response)=>{
    const sql = 'SELECT * FROM CourseInfo ORDER BY year,semester ASC '
    results = await db.promise().query(sql)
    response.send(results[0])
})


module.exports = router