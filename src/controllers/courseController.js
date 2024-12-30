const express = require("express");
const courseModel = require("../lib/course");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");

const router = express.Router();

// Base CRUD routes
const baseRouter = createBaseRouter(courseModel);
router.use("/courses", baseRouter);

module.exports = router;