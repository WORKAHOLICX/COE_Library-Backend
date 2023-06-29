const bcrypt = require('bcryptjs');
const db = require('../models/database')

function hashpassword (password){
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

function comparepassword (raw, hash){
    return bcrypt.compareSync(raw, hash);
}

function updateAccess(programme, course){
    let sql = `UPDATE CourseInfo SET access = access +1 WHERE id = ? AND IDM =?`
    const results =  db.promise().query(sql, [course, programme])
    return results[0]
}

async function retrieveRecommended(programme){
    let sql = `(SELECT * FROM CourseInfo WHERE IDM = ? ORDER BY access DESC LIMIT 5)`
    
    const results = await db.promise().query(sql, programme)
    return results[0]
}

module.exports = {
    hashpassword,
    comparepassword,
    updateAccess,
    retrieveRecommended
}