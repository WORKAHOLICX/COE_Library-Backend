const express = require("express");
const router = express.Router();
const db = require("../../models/database");
const courseRouter = require('./courses');
const { Deta } = require('deta');
const upload = require('express-fileupload');
const fs = require('fs')
require('dotenv').config();


router.use("/course", courseRouter);
router.use(upload());
const deta = Deta(projectKey = process.env.DETA_KEY);
const courseBooks = deta.Drive(driveName = process.env.DETA_DRIVENAME);

//Creates a form to allow user upload a book

router.get('/', (req, res) => {
    res.send(`
    <form action="admin/upload" enctype="multipart/form-data" method="post">
      <input type="file" name="filetoUpload" required accept="application/pdf, .txt, .docx , .doc, .pptx"> 
      <input type="submit" value="Upload">
    </form>`);
    //accept attribute restricts the upload form to only specified file types
    console.log('Starting file upload');
});

//this request handles the upload of the specified book to the Deta drive
router.post("/upload", async (request, response, next) => {
    const { programme, level, semester, courseName } = request.body;
    const directory = `${programme}/${level}/${semester}/${courseName}/Slides`
    const names = `${directory}/${request.files.filetoUpload.name}`;
    const contents = request.files.filetoUpload.data;
    const storeBook = await courseBooks.put(names, { data: contents });

    const direct = `${programme}/${level}/${semester}/${courseName}/Slides/`
    const array = []
    const ext = []
    const bookList = await courseBooks.list(
        { prefix: direct });
    const bookShelf = bookList.names;
    const myarray = bookShelf.map(x => x.split(direct))

    var i = 0;
    myarray.forEach(element => {
        ext[0] = element.map(x => x.split(`.`))
        array[i] = ext[0][1][0]
        i = i + 1
    });

    const prog = programme.split(" ");
    const progr = prog[0].toLowerCase();

    const Arrlength = array.length;
    const newLectarr = [];
    for (let i = 1; i <= Arrlength; i++) {
        newLectarr.push(i);
    }

    const jsonArr = JSON.stringify(newLectarr);
    const sql = `UPDATE CourseInfo SET slides = ?, ext=? WHERE IDM =? AND name=?`;
    db.query(sql, [jsonArr, ext[0][1][1], progr, courseName])//Edit program ere
    response.send(` ${progr} ${courseName} lectures uploaded to database: ` + jsonArr);

    console.log('Successful file upload');
});

router.post("/delete", async (request, response, next) => {
    const { programme, level, semester, courseName, filetoDelete } = request.body;
    const directory = `${programme}/${level}/${semester}/${courseName}/Slides/${filetoDelete}`
    const deleteBook = await courseBooks.delete(directory);

    const direct = `${programme}/${level}/${semester}/${courseName}/Slides/`
    const array = []
    const ext = []
    const bookList = await courseBooks.list(
        { prefix: direct });
    const bookShelf = bookList.names;
    const myarray = bookShelf.map(x => x.split(direct))

    var i = 0;
    myarray.forEach(element => {
        ext[0] = element.map(x => x.split(`.`))
        array[i] = ext[0][1][0]
        i = i + 1
    });

    const prog = programme.split(" ");
    const progr = prog[0].toLowerCase();
    const exte = filetoDelete.slice(-3);

    const Arrlength = array.length;
    const newLectarr = [];
    for (let i = 1; i <= Arrlength; i++) {
        newLectarr.push(i);
    }

    const jsonArr = JSON.stringify(newLectarr);
    const sql = `UPDATE CourseInfo SET slides = ?, ext=? WHERE IDM =? AND name=?`;
    { db.query(sql, [jsonArr, jsonArr === [] ? "" : exte, progr, courseName]) }
    response.send(` ${progr} ${courseName} lectures uploaded to database: ` + jsonArr);

    console.log('Successful Deletion');
});

router.get('/name', async (request, response,) => {
    response.send(`<form action="admin/rename" enctype="multipart/form-data" method="post" >
    <label for="oldName">OldName:</label>
    <input type="text" name="oldName" id="oldName">
    </form>`)
    console.log('Starting file rename');

});

router.get('/rename', async (request, response,) => {
    const { oldName } = req.body;
    const { newName } = req.body;
    fs.rename(`${oldName}`, `${newName}`)
    let sql = `UPDATE Courses SET img = "https://th.bing.com/th/id/R.d03c6da728d2d9db994ced40346e68d5?rik=cMUcZXiBNEIdAg&pid=ImgRaw&r=0" WHERE IDM = "biomedical" AND name="Algebra" `;;
    const result = await db.promise().query(sql, [newName])
    console.log("File Renamed")
});


module.exports = router;

