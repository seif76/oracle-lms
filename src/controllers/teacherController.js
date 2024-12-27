const express = require("express");
const teacherModel = require("../lib/teacher");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");

const router = express.Router();

// Base CRUD routes
const baseRouter = createBaseRouter(teacherModel);
router.use("/teachers", baseRouter);

module.exports = router;