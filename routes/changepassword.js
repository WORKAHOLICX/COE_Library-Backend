const express = require("express")
const router = express.Router();
const db = require("../models/database")


router.use( (request, response, next) =>{
    if(request.user) next()
    else {
        response.status(401).send({msg: "User is not Logged In"})
    }
})

router.get('/', async(request, response) => {
    const { oldPassword, newPassword, username } = request.params
    const sql = `SELECT (username, password) FROM student WHERE username=?`
    const result = await db.promise().query(sql, [username]);
    
    try{
    if(result[0]?.password == oldPassword){
        //change password
        sql = "UPDATE student SET password=? WHERE username = ? "
        db.query(sql, [newPassword, username]);
        response.sendStatus(200)
    }
    }   catch(error){
        console.log(error);
        response.sendStatus(404)
    }


})


module.exports = router