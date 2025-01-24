const express = require("express");
const videoModel = require("../lib/video");
const CourseModel = require("../lib/course");
const TeacherModel = require("../lib/teacher");
const accessCodeModel = require("../lib/accessCode");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");
const mongoose = require('mongoose');

const { generateAccessCodes } = require('../services/accessCodes');

const router = express.Router();

// Base CRUD routes
const baseRouter = createBaseRouter(videoModel);
router.use("/videos", baseRouter);


// this is the api that will get videos assigned to a specific course
router.get('/videos/course/:courseId', async (req, res) => {
    try {
      await connectToDataBase(); // Ensure DB connection
      const { courseId } = req.params; // Extract courseId from the URL

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid courseId format" });
      }
     
      const videos = await videoModel.find({ courseId }).exec(); // Find videos by courseId
      const Course = await CourseModel.findOne({ _id: courseId }).exec(); // find the course
      const Teacher = await CourseModel.findOne({ _id: courseId })
      .populate('teacherId') // Populate the teacher document using the reference
      .exec();


      // if (videos.length === 0) {
      //   return res.status(404).json({ message: 'No videos found for this course.' });
      // }
  
      res.status(200).json({
        Course:Course,
        videos:videos,
        Teacher:Teacher.teacherId // send only the teacher here
      }); 
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ message: 'Error fetching videos.' });
    }
  });
// this is the api that will post video in admin dashboard also teacher dashboard
router.post('/videos/video' , async (req, res) => {

  try {
    await connectToDataBase(); // Ensure DB connection
    
     // Step 1: Create and save the video
    const { title, description, youtubeLink, courseId, accessCodeCount } = req.body;
    const newVideo = new videoModel({ title, description, youtubeLink, courseId });
    const savedVideo = await newVideo.save(); // Save new video
    // Step 2: Generate and save access codes for the video
    const accessCodes = await generateAccessCodes(savedVideo._id,accessCodeCount || 10); // Default to 10 codes if not provided
    
    res.status(201).json({
      video: savedVideo,
      accessCodes: accessCodes, // Return just the codes to the client
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating video" });
  }
});  





module.exports = router;