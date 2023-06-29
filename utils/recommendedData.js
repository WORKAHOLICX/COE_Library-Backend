const db = require('../models/database')

function updateAccess(programme, course){
    let sql = `UPDATE ${programme} SET access = access +1 WHERE course = ?`
    const results = db.promise().query(sql, course)
    return results[0]
}

 function retrieveRecommended(programme){
    let sql = `SELECT course FROM ${programme} ORDER BY access DESC`
    const results = db.promise().query(sql)
    return results[0]
}

module.exports = {
    updateAccess,
    retrieveRecommended,
}