const express = require("express");
const router = express.Router();
const { Deta } = require("deta");
const upload = require("express-fileupload");
router.use(upload());
const deta = Deta((projectKey = process.env.DETA_KEY));
const courseBooks = deta.Drive((driveName = process.env.DETA_DRIVENAME));

router.use((request, response, next) => {
  if (request.user) next();
  else {
    console.log("here");
    response.sendStatus(401);
  }
});

router.post("/", async (req, res) => {
  const { programme, year, semester, course, slide_name } = req.body;
  const year_semester = [];

  switch (year) {
    case 1:
      year_semester[0] = "First Year";
      break;
    case 2:
      year_semester[0] = "Second Year";
      break;
    case 3:
      year_semester[0] = "Third Year";
      break;
    case 4:
      year_semester[0] = "Fourth Year";
      break;
    default:
      break;
  }

  switch (semester) {
    case 1:
      year_semester[1] = "First Semester";
      break;
    case 2:
      year_semester[1] = "Second Semester";
      break;
    default:
      break;
  }

  const bookName = {
    name: `${programme}/${year_semester[0]}/${year_semester[1]}/${course}/Slides/${slide_name}`,
  };

  try {
    const book = await courseBooks.get(bookName.name);
    if (!book || book === null) {
      res.status(400).send(`${slide_name} for ${course} is not available`);
    } else {
      const buffer = await book.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
