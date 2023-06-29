const db = require('../database');

db.connect((err) => {
    if (err) throw err;
    //request will be made with the program, level andbook
    let sql = 'CREATE TABLE Computer(id INT access DEFAULT 0, course VARCHAR(255))';
    db.query(sql, function (err, results) {
        if (err) throw err;
        console.log(results);
    });
})