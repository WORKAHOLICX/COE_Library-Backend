const express = require('express');
const router = express.Router();

router.use((request, response, next) => {
    console.log({ "program": request.sessionID });
    if (request.user) next()
    else {
        response.status(401).send({ msg: "User is not Logged In" })
    }
})


const computerRouter = require("./Programs/computer")
const aerospaceRouter = require("./Programs/Aerospace")
const agricRouter = require("./Programs/Agricultural")
const biomedRouter = require("./Programs/Biomedical")
const chemRouter = require("./Programs/Chemical")
const civilRouter = require("./Programs/Civil")
const electricalRouter = require("./Programs/Electrical")

const geoRouter = require("./Programs/Geological")
const geomaticRouter = require("./Programs/Geomatic")
const materialsRouter = require("./Programs/Materials")
const mechanicRouter = require("./Programs/Mechanical")
const metallurRouter = require("./Programs/Metallurgical")
const petrochemRouter = require("./Programs/Petrochemical")
const petroleumRouter = require("./Programs/Petroleum")
const telecomRouter = require("./Programs/Telecom")



router.use((request, response, next) => {
    if (request.user) next()
    else {
        console.log("Program ");
        response.sendStatus(401)
    }
})


router.use("/computer", computerRouter);
router.use("/biomedical", biomedRouter);
router.use("/telecom", telecomRouter);
router.use("/electrical", electricalRouter);



module.exports = router;