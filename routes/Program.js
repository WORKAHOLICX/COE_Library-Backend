const express = require("express");
const router = express.Router();

router.use((request, response, next) => {
  console.log({ program: request.sessionID });
  if (request.user) next();
  else {
    response.status(401).send({ msg: "User is not Logged In" });
  }
});

const getFileRouter = require("./Programs/getDetaFile");

router.use((request, response, next) => {
  if (request.user) next();
  else {
    response.sendStatus(401);
  }
});

router.use("/getDetaFile", getFileRouter);

module.exports = router;
