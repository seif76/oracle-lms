const express = require("express");
const enrollmentModel = require("../lib/enrollment");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");

const router = express.Router();

// Base CRUD routes
const baseRouter = createBaseRouter(enrollmentModel);
router.use("/enrollments", baseRouter);

module.exports = router;