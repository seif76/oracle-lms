const express = require("express");
const adminModel = require("../lib/admin");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");

const router = express.Router();

// Base CRUD routes
const baseRouter = createBaseRouter(adminModel);
router.use("/admins", baseRouter);

module.exports = router;