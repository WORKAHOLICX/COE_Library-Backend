const express = require("express");
const router = express.Router();
const db =  require("../models/database");
const nodemailer = require('nodemailer')
const encrypt = require('crypto')


router.post('/', async function(request, response){
    const {email} = request.body;
    const result = await db.promise().query(`SELECT * FROM student WHERE email = '${email}'`)
    if(result[0].length == 0){
        return response.status(400).send("User does not exist")
    }

   
    const sql = `INSERT INTO password_token (email, token) VALUES (?,?)` 
    const link = []
    const varInstance = process.env.EC2_INSTANCE ;
      encrypt.randomBytes(48,async function(err, buffer) {
      const token = buffer.toString('hex');
      await db.promise().query(sql, [email, token])
      
       var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
          user:'hoffteam59@gmail.com',
          pass:'ynyqaswefmopnpqb'
        },
        tls: {
            rejectUnauthorized: false
          }
      });
      
      var mailOptions = {
        from: 'hoffteam59@gmail.com',
        to: `${email}`,
        subject: 'Team Hoff Virtual Library',
        html: `<p>Click <a href=`+varInstance+`/resetpassword?token=${token}` + '>here</a> to reset your password</p>'
      };
      
      transporter.sendMail(mailOptions, function(err, info){
        if (err) return console.log(err);
        else return console.log("email sent " + `to ${email}`);
      });
      return response.send(link[0])
    });

    

      
    
})

module.exports = router