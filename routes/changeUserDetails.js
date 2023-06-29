const express = require("express")
const router = express.Router();
const db = require("../models/database")
const {comparepassword, hashpassword} = require("../utils/helper")

router.use( (request, response, next) =>{
    console.log({"CHANGE USER DETAILS":request.sessionID});
    if(request.user) next()
    else {
        response.status(401).send({msg: "User is not Logged In"})
    }
})

router.post('/', async(request, response) => {
    try{
        const {email, password} = request.user
        const {field, new_value} = request.body;
        let sql = `UPDATE student SET ${field} = ? WHERE email=? `
        
        switch (field) {
            case "password":
                console.log("here");
                const { old_value } = request.body;
               let p_sql = `UPDATE student SET ${field} = ? WHERE email=? `
                console.log(comparepassword(old_value, password));
                if(comparepassword(old_value, password)){
                    const new_password = hashpassword(new_value);
                    await db.promise().query(p_sql,[new_password, email])
                    return response.status(200).send({"msg": `${field} changed`})
                }
                else{
                    return response.status(400).send({"msg": `${field} incorrect`})
                }
                break ;
            case "username":
                const sql = `SELECT * FROM student WHERE username = ?`
                const result = await db.promise().query(sql,[new_value]);
                if(result[0].length !== 0){
                    return response.status(400).send({"msg": `${field} is already taken`})
                }
                break;
            default:
                
                break;
        }
                console.log("hre");
                await db.promise().query(sql, [new_value, email])
                response.status(200).send({"msg": `${field} changed`})
        
    }
    catch(error){
        console.log(error)
    }
})


module.exports = router