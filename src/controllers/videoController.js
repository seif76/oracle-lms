const express = require("express");
const videoModel = require("../lib/video");
const CourseModel = require("../lib/course");
const AccessCodeModel = require("../lib/accessCode"); 
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");
const mongoose = require('mongoose');
const { generateAccessCodes } = require('../services/accessCodes');

const multer = require("multer");

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

//module.exports = router;


// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // Limit file size to 4MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept only image files
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Route to get all videos with course name populated Admin Dashboard
router.get("/videos/videos-with-course-name", async (req, res) => {
  try {
    await connectToDataBase();

    // Fetch all videos and populate course name
    const videos = await videoModel
      .find({})
      .populate("courseId", "title") // Populate the `title` field of the associated course
      .exec();

    // Transform response to include Base64-encoded images and courseId
    const transformedVideos = videos.map((video) => {
      const imageExists = video.image && video.image.data && video.image.contentType;
      return {
        _id: video._id,
        title: video.title,
        description: video.description,
        courseId: video.courseId?._id || null, // Include `courseId`
        courseName: video.courseId?.title || "Unknown Course", // Course name from `populate`
        youtubeLink: video.youtubeLink,
        createdAt: video.createdAt,
        image: imageExists
          ? `data:${video.image.contentType};base64,${video.image.data.toString("base64")}`
          : null, // If no image, send null
      };
    });

    res.status(200).json(transformedVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch single video details with course name
router.get('/vidoes/video/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDataBase();
    const video = await videoModel.findById(id).populate('courseId', "title");
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new video with an uploaded image
router.post("/newVideo", upload.single("image"), async (req, res) => {
  const { title, description, courseId, youtubeLink, accessCodeCount } = req.body;
  const file = req.file;

  // Validate incoming data
  if (!title || !courseId || !youtubeLink || !file) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await connectToDataBase();

    // Step 1: Create and save the video with the uploaded image
    const newVideo = new videoModel({
      title,
      description,
      courseId,
      youtubeLink,
      image: {
        data: file.buffer,
        contentType: file.mimetype,
      },
    });
    const savedVideo = await newVideo.save();

    // Step 2: Generate access codes for the video
    const accessCodes = await generateAccessCodes(savedVideo._id, accessCodeCount || 10); // Default to 10 codes

    // Respond with the video and generated access codes
    res.status(201).json({
      video: {
        _id: savedVideo._id,
        title: savedVideo.title,
        description: savedVideo.description,
        courseId: savedVideo.courseId,
        youtubeLink: savedVideo.youtubeLink,
        createdAt: savedVideo.createdAt,
        image: `data:${savedVideo.image.contentType};base64,${savedVideo.image.data.toString("base64")}`,
      },
      accessCodes: accessCodes, // Return the codes
    });
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Route to update an existing video by ID, including replacing the image
router.put("/videos/updateVideoById/:id", upload.single("image"), async (req, res) => {
  try {
    await connectToDataBase();

    const { title, description, courseId, youtubeLink, numberOfCodes } = req.body;
    const file = req.file;
    

    // Step 1: Find the video to update
    const video = await videoModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Step 2: Update video fields only if they are provided
    if (title) video.title = title;
    if (description) video.description = description;
    if (courseId) video.courseId = courseId;
    if (youtubeLink) video.youtubeLink = youtubeLink;

    // If a new image is uploaded, replace the existing one
    if (file) {
      video.image = {
        data: file.buffer,
        contentType: file.mimetype,
      };
    }

    const updatedVideo = await video.save();

    // Step 3: Optionally generate new access codes if requested
    
    await generateAccessCodes(updatedVideo._id, numberOfCodes || 10); // Default to 10 codes
    
   

    // Respond with the updated video and newly generated access codes (if any)
    res.status(200).json({
      video: {
        _id: updatedVideo._id,
        title: updatedVideo.title,
        description: updatedVideo.description,
        courseId: updatedVideo.courseId,
        youtubeLink: updatedVideo.youtubeLink,
        createdAt: updatedVideo.createdAt,
        image: updatedVideo.image
          ? `data:${updatedVideo.image.contentType};base64,${updatedVideo.image.data.toString("base64")}`
          : null,
      },
       // Include codes if generated
    });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to delete a video and its corresponding access code
router.delete("/videos/deleteVideoById/:id", async (req, res) => {
  try {
    await connectToDataBase();

    const { id: videoId } = req.params;

    // Validate video ID
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID format" });
    }

    // Step 1: Find and delete the video
    const deletedVideo = await videoModel.findByIdAndDelete(videoId).exec();
    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Step 2: Find and delete the access code associated with the video
    //const deletedAccessCode = await AccessCodeModel.findOneAndDelete({ videoId });
    const accessCodeToDelete = await AccessCodeModel.findOne({ videoId }).exec();
    if (accessCodeToDelete) {
      await AccessCodeModel.findByIdAndDelete(accessCodeToDelete._id).exec(); // Pass only the ID as a string
    } else {
      console.log("No access codes found!");
    }

    res.status(200).json({
      message: "Video and corresponding access code deleted successfully",
      deletedVideo,
      accessCodeToDelete,
    });
  } catch (error) {
    console.error("Error deleting video and access code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// start for teacher dashboard

// get videos for a specific teacher Id 
router.get("/videos/videos-by-teacher/:teacherId", async (req, res) => {
  const { teacherId } = req.params; // Get the teacher ID from the route parameter

  try {
    await connectToDataBase(); // Ensure database connection

    // Find courses assigned to the teacher
    const courses = await CourseModel.find({ teacherId }).exec();

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this teacher." });
    }

    // Extract course IDs
    const courseIds = courses.map((course) => course._id);

    // Find videos assigned to these courses
    const videos = await videoModel
      .find({ courseId: { $in: courseIds } }) // Match videos with course IDs
      .populate("courseId", "title") // Populate the course title
      .exec();

    // Transform response to include Base64-encoded images and course details
    const transformedVideos = videos.map((video) => {
      const imageExists = video.image && video.image.data && video.image.contentType;
      return {
        _id: video._id,
        title: video.title,
        description: video.description,
        courseId: video.courseId?._id || null, // Include course ID
        courseName: video.courseId?.title || "Unknown Course", // Course name from `populate`
        youtubeLink: video.youtubeLink,
        createdAt: video.createdAt,
        image: imageExists
          ? `data:${video.image.contentType};base64,${video.image.data.toString("base64")}`
          : null, // If no image, send null
      };
    });

    res.status(200).json(transformedVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// End for teacher dashboard



module.exports = router;
