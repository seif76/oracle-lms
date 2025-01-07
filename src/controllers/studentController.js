const express = require("express");
const studentModel = require("../lib/student");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");

const router = express.Router();

// Base CRUD routes
const baseRouter = createBaseRouter(studentModel);
router.use("/students", baseRouter);

module.exports = router;