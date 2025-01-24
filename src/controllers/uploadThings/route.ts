const express = require("express");
const { createRouteHandler } = require("uploadthing/express");

//import { createRouteHandler } from "uploadthing/express";
 
//import { uploadRouter } from "./core";

const { uploadRouter } = require("./core.ts");


const router = express.Router();

 
router.use(
  "/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  }),
);