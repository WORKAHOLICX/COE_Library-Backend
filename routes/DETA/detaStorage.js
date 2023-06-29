const express = require('express');
const router =express.Router();
const db = require("../../models/database")
const {Deta} =require('deta');
require('dotenv').config();
// const dotenv = require('dotenv');
// const path = require('path')
// dotenv.config({path: './.env'})


// var http = require('http');
// var fs = require('fs');
// const path = require('path');






// Product key to access Deta Drive
const deta = Deta(projectKey=process.env.DETA_KEY);


// Unique name of Deta Drive
const courseBooks = deta.Drive(driveName=process.env.DETA_DRIVENAME);

// this request enables user to retrieve a specified item from Deta Drive
router.get("/download", async (req, res) => {
    
    const bookName = {
        name: 'Computer Engineering/Third Year/First Semester/Numerical Analysis/Slides/Lecture One.pdf'
    };
    
    const book = await courseBooks.get(bookName.name);
    const buffer = await book.arrayBuffer();
    res.send(Buffer.from(buffer));
    console.log('file is being downloaded');
});

// this request enables user to see all items in a specifc Deta Drive


// router.get("/list?name", async (req, res) => {
//     const bookName = {
//         name: '${proram}/Third Year/First Semester/Numerical Analysis/'
//     };
//     const bookList = await courseBooks.list('Computer Engineering');
//     res.send(bookList);
//     console.log('All files in drive');
// });


//lists all files in Deta Drive
// router.get("/list", async (req, res) => {
//     // const bookName = {
//     //     name: 'Computer Engineering/Third Year/First Semester/Numerical Analysis/'
//     // };
//     const bookList = await courseBooks.list();
//     const bookShelf = bookList.names;
//     res.send(bookShelf);
//     console.log('All files in drive');
// }); 



//places names of course in database
router.get("/list", async (req, res) => {
    const program = `Electrical Engineering`
    const name = `Calculus with Analysis`
    const courses = `${program}/First Year/Second Semester/${name}/Slides/` //Edit year and semester
    //const {year} = req.params;
    const array = []
    const ext = []
    const bookList = await courseBooks.list(
        {prefix: courses});
    const bookShelf = bookList.names;
    const myarray = bookShelf.map(x=>x.split(courses))

    var i = 0;
    myarray.forEach(element => {
        ext[0] = element.map(x=>x.split(`.`))
        array[i]=ext[0][1][0]
        i=i+1
    });

    
    console.log(array);
    const Arrlength = array.length;
    const newLectarr = [];
    console.log(Arrlength);
    //const i =1;
    for(let i=1;i<=Arrlength;i++){
    newLectarr.push(i);

}
    console.log(newLectarr);
    const jsonArr = JSON.stringify(newLectarr);
    console.log(jsonArr);
    const sql = `UPDATE CourseInfo SET slides = ?, ext=? WHERE IDM =? AND name=?`;
    db.query(sql, [jsonArr, ext[0][1][1], `electrical`, name])//Edit program ere
    res.send(` ${program} ${name} lectures uploaded to database: `+array);
    //console.log(` ${program} ${name} lectures uploaded to database`);
}); 



module.exports = router;