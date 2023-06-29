const express = require('express');
const router = express.Router();

const db = require('../models/database')


router.get('/', async (req, res) => {

    let sql = 'DESCRIBE student';
    const result = await db.promise().query(sql)

    const fields = result[0].map(a => a.Field)
    res.send(fields)
})


module.exports = router;

