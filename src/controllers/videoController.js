const express = require("express");
const videoModel = require("../lib/video");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");
const mongoose = require('mongoose');

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
  
      if (videos.length === 0) {
        return res.status(404).json({ message: 'No videos found for this course.' });
      }
  
      res.status(200).json(videos); // Return the videos as a JSON response
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

// Route to get all videos with course name populated
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


// router.get("/videos/videos-with-course-name", async (req, res) => {
//   try {
//     await connectToDataBase();

//     // Fetch all videos and populate course name
//     const videos = await videoModel
//       .find({})
//       .populate("courseId", "title") // Populate the `title` field of the associated course
//       .exec();

//     // Transform response to include Base64-encoded images
//     const transformedVideos = videos.map((video) => {
//       const imageExists = video.image && video.image.data && video.image.contentType;
//       return {
//         _id: video._id,
//         title: video.title,
//         description: video.description,
//         courseName: video.courseId?.title || "Unknown Course", // Course name from `populate`
//         youtubeLink: video.youtubeLink,
//         createdAt: video.createdAt,
//         image: imageExists
//           ? `data:${video.image.contentType};base64,${video.image.data.toString("base64")}`
//           : null, // If no image, send null
//       };
//     });

//     res.status(200).json(transformedVideos);
//   } catch (error) {
//     console.error("Error fetching videos:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// Route to create a new video with an uploaded image
router.post("/newVideo", upload.single("image"), async (req, res) => {
  const { title, description, courseId, youtubeLink } = req.body;
  const file = req.file;

  // Validate incoming data
  if (!title || !courseId || !youtubeLink || !file) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await connectToDataBase();

    // Create a new video with the uploaded image data
    const newVideo = await videoModel.create({
      title,
      description,
      courseId,
      youtubeLink,
      image: {
        data: file.buffer,
        contentType: file.mimetype,
      },
    });

    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update an existing video by ID, including replacing the image
router.put("/videos/updateVideoById/:id", upload.single("image"), async (req, res) => {
  try {
    await connectToDataBase();

    const { title, description, courseId, youtubeLink } = req.body;
    const file = req.file;

    // Find the video to update
    const video = await videoModel.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Update fields only if they are provided
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

    res.status(200).json({
      _id: updatedVideo._id,
      title: updatedVideo.title,
      description: updatedVideo.description,
      courseName: updatedVideo.courseId, // Include course name
      youtubeLink: updatedVideo.youtubeLink,
      createdAt: updatedVideo.createdAt,
      image: updatedVideo.image
        ? `data:${updatedVideo.image.contentType};base64,${updatedVideo.image.data.toString("base64")}`
        : null,
    });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to delete a video by ID
router.delete("/videos/deleteById/:id", async (req, res) => {
  try {
    await connectToDataBase();

    const video = await videoModel.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
