const db = require('../database');

db.connect( (err) => {
    if (err) throw err;
    
    let sql = 'CREATE TABLE student(id INT PRIMARY KEY AUTO_INCREMENT, fullname VARCHAR(255), email VARCHAR(255),  username VARCHAR(55), password VARCHAR(255), programme VARCHAR(50), year VARCHAR(10))';
  db.query(sql, function (err, results){
    if (err) throw err;
    console.log(results);
  });
})