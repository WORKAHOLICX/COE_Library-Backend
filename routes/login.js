const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const db = require('../models/database')
const { hashpassword, comparepassword } = require("../utils/helper");




router.get('/', (req, res) => {
    res.status(200).send("logging in?")
});

router.post('/', passport.authenticate('local'), (req, res) => {
    console.log(req.sessionID);
    res.status(200).send(req.sessionID);
})

module.exports = router;