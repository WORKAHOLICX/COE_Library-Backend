const { Router } = require("express");
const router = Router();
const db = require("../models/database");
const { updateAccess } = require("../utils/helper");

router.use((request, response, next) => {
  console.log({ COURSE: request.sessionID });
  if (request.user) next();
  else {
    response.status(401).send({ msg: "User is not Logged In" });
  }
});

router.get("/:programme", async (request, response) => {
  const { programme } = request.params;
  console.log(programme);
  let sql = `SELECT name,IDM,id,year,semester,img FROM  CourseInfo WHERE IDM = ?`;
  const result = await db.promise().query(sql, [programme]);
  response.send(result[0]);
});

router.get("/:programme/:course", async (request, response) => {
  const { programme, course } = request.params;
  await updateAccess(programme, course);
  const slides_books = [];
  let sql = `SELECT * FROM  CourseInfo WHERE IDM = ? AND id=?`;
  const slides = await db.promise().query(sql, [programme, course]);
  slides_books[0] = slides[0];
  sql = `SELECT * FROM CourseBooks WHERE courseName = ?`;
  const books = await db.promise().query(sql, [slides[0][0].name]);
  slides_books[1] = books[0];

  response.send(slides_books);
});
module.exports = router;
