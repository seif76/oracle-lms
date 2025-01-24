//import { createUploadthing, type FileRouter } from "uploadthing/express";
//const { createRouteHandler } = require("uploadthing/express");
const { createUploadthing, OurFileRouter } = require('uploadthing/express');

const f = createUploadthing();
 
export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
};
 
export type OurFileRouter = typeof uploadRouter;