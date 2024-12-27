const express = require("express");
const videoModel = require("../lib/video");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");

const router = express.Router();

// Base CRUD routes
const baseRouter = createBaseRouter(videoModel);
router.use("/videos", baseRouter);

module.exports = router;