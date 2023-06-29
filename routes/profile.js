const express = require('express')
const router = express.Router()



router.use( (request, response, next) =>{
    console.log({"profile": request.sessionID});
    if(request.user) next()
    else {
        response.sendStatus(401)
    }
})

router.get("/", (request, response) => {
    response.send(request.user)
})


module.exports = router