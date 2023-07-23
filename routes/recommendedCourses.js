const express = require("express");
const router = express.Router();
const db = require("../models/database");
const courses = require("../models/CourseData.json");
const { retrieveRecommended } = require("../utils/helper");

let list = "";

let i = 0;
let checker = 0;
let a = -1;
courses.map((course) => {
  if (course.IDM == "mechanical") {
    checker += 1;
    if (checker == 91) {
      // console.log(checker, i);
      a = i;
    }
    if (i == a && i != -1) list += `('${course.id}')`;
    else list += `('${course.id}'),`;
  }
  i++;
});
// console.log(list, checker);

function lower(programme) {
  let p = programme.split(" ");
  return p[0].toLowerCase();
}

router.get("/table", async (request, response) => {
  // let sql = 'CREATE TABLE mechanical(access INT DEFAULT 0,  course VARCHAR(255))';
  let sql = "INSERT INTO mechanical(course) VALUES " + list;
  // let sql = "UPDATE mechanical SET access = access +1 WHERE course = ?"
  // let sql = 'SELECT course FROM mechanical ORDER BY access DESC'
  const results = await db.promise().query(sql, "mobileandsatellitecommsystem");

  response.send(results[0]);
});

router.get("/", async (request, response) => {
  const programme = request?.user?.programme ?? "Computer Engineering";
  const p = await retrieveRecommended(lower(programme));
  response.send(p);
});

module.exports = router;
