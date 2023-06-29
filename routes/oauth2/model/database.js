const mysql=require('mysql2');
const db=mysql.createConnection({
    host:'localhost',
    user:'kingbuffer',
    password:'2030buffer',
    database:'Authentication2',
    

})
db.connect((err)=>{
    if(err)
    {
        throw err

    }
    else
    {
        console.log('db conneted successfully......')
    }
})
module.exports=db;