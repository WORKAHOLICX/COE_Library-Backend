const express = require("express");
const router = express.Router();
const db = require("../../models/database");
const courseRouter = require("./courses");
const { Deta } = require("deta");
const upload = require("express-fileupload");
const fs = require("fs");
require("dotenv").config();

router.use("/course", courseRouter);
router.use(upload());
const deta = Deta((projectKey = process.env.DETA_KEY));
const courseBooks = deta.Drive((driveName = process.env.DETA_DRIVENAME));

router.post("/upload", async (request, response, next) => {
  const { programme, level, semester, courseName } = request.body;
  const directory = `${programme}/${level}/${semester}/${courseName}/Slides`;
  const names = `${directory}/${request.files.filetoUpload.name}`;
  const contents = request.files.filetoUpload.data;
  await courseBooks.put(names, { data: contents });

  const direct = `${programme}/${level}/${semester}/${courseName}/Slides/`;
  const bookList = await courseBooks.list({ prefix: direct });
  const bookShelf = bookList.names;

  const prog = programme.split(" ");
  const progr = prog[0].toLowerCase();

  const slideNames = bookShelf.map((name) => name.split(direct)[1]);

  try {
    const sql = `UPDATE CourseInfo SET slides = ? WHERE IDM = ? AND name = ?`;
    db.query(sql, [JSON.stringify(slideNames), progr, courseName]);
    response.send(
      `${progr} ${courseName} lectures uploaded to database: ${slideNames}`
    );
    console.log("Successful file upload");
  } catch (error) {
    console.error("Error updating database:", error);
    response.status(500).send("Error uploading lectures to database.");
  }
});

router.post("/delete", async (request, response, next) => {
  const { programme, level, semester, courseName, filetoDelete } = request.body;
  const directory = `${programme}/${level}/${semester}/${courseName}/Slides/${filetoDelete}`;
  await courseBooks.delete(directory);

  const direct = `${programme}/${level}/${semester}/${courseName}/Slides/`;
  const bookList = await courseBooks.list({ prefix: direct });
  const bookShelf = bookList.names;

  const prog = programme.split(" ");
  const progr = prog[0].toLowerCase();

  const slideNames = bookShelf.map((name) => name.split(direct)[1]);

  const indexToDelete = slideNames.indexOf(filetoDelete);
  if (indexToDelete !== -1) {
    slideNames.splice(indexToDelete, 1);
  }

  try {
    const sql = `UPDATE CourseInfo SET slides = ? WHERE IDM = ? AND name = ?`;
    db.query(sql, [JSON.stringify(slideNames), progr, courseName]);
    response.send(
      `${progr} ${courseName} lectures deleted from database: ${slideNames}`
    );
    console.log("Successful Deletion");
  } catch (error) {
    console.error("Error updating database:", error);
    response.status(500).send("Error deleting lecture from database.");
  }
});

module.exports = router;
