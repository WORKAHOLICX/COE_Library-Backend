const express = require('express');
const router = express.Router();
const db = require('../../models/database')

router.get('/', async (request, response) => {
    const sql = 'SELECT name FROM CourseInfo';
    const results = await db.promise().query(sql);
    const courses = results[0];
    response.status(200).send(courses);


})

router.get('/users', async (request, response) => {
    const sql = 'SELECT id FROM student';
    const results = await db.promise().query(sql);
    const users = results[0];
    response.status(200).send(users);


})
module.exports = router;