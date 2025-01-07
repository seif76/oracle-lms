const express = require("express");
const videoModel = require("../lib/video");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");
const mongoose = require('mongoose');

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
  
      if (videos.length === 0) {
        return res.status(404).json({ message: 'No videos found for this course.' });
      }
  
      res.status(200).json(videos); // Return the videos as a JSON response
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ message: 'Error fetching videos.' });
    }
  });



module.exports = router;