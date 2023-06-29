const express = require('express')
const router = express.Router()
const videos = require('../models/videos.json')
const { searchinfo } = require('../utils/videoRetriever')

router.get('/', async(request, response) => {
    // results = await searchinfo()
    response.status(200).send(videos[1])
})

module.exports = router