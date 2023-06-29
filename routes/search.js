const { Router } = require('express');
const router = Router();

const db = require('../models/database')

router.use((request, response, next) => {
    console.log({ "SEARCH": request.sessionID });
    if (request.user) next()
    else {
        response.sendStatus(401)
    }
})

router.get('/', async (request, response,) => {
    const { course } = request.params;
    let sql = `SELECT name,IDM,id FROM  CourseInfo `;
    const result = await db.promise().query(sql, [course]);
    response.send(result[0]);

});






module.exports = router;