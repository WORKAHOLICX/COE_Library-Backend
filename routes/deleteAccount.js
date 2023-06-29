const express = require("express")
const router = express.Router();
const db = require("../models/database")

router.use( (request, response, next) =>{
    console.log({"DELETE ":request.sessionID});
    if(request.user) next()
    else {
        response.status(401).send({msg: "User is not Logged In"})
    }
})

router.delete('/', async(request, response) => {
    try{

        //Deletes account from database
        const {email, password } = request.user;
        const session_sql="DELETE FROM sessions WHERE session_id = ?";
        await db.promise().query(session_sql, [request?.sessionID]);
        const sql = `DELETE FROM student WHERE email=? AND password=?`;
        await db.promise().query(sql, [email, password])   
        
        return response.status(200).send({msg: "Account deleted"});
    }
    catch{
        console.log("Error")
    }

    
    
    


})


module.exports = router