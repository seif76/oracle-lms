const express = require("express");
const videoModel = require("../lib/video");
const CourseModel = require("../lib/course");
const TeacherModel = require("../lib/teacher");
const accessCodeModel = require("../lib/accessCode");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");
const mongoose = require('mongoose');

const { validateAndUseAccessCode } = require('../services/accessCodes');

const router = express.Router();

// Base CRUD routes




// const validateAccessCodeController = async (req, res) => {
//   const { code, studentId } = req.body;

//   if (!code || !studentId) {
//     return res.status(400).json({ message: 'Code and studentId are required' });
//   }

//   try {
//     const result = await validateAndUseAccessCode(code, studentId);

//     if (result.isValid) {
//       return res.status(200).json(result);
//     } else {
//       return res.status(400).json(result); // Return error from the service
//     }
//   } catch (error) {
//     console.error('Error in AccessCodesController:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


router.post('/AccessCode/validate' , async (req, res) => {

    const { videoId, code, studentId } = req.body;

  // Validate input
  if (!videoId || !code || !studentId) {
    return res.status(400).json({
      message: "videoId, code, and studentId are required.",
    });
  }

  try {
    await connectToDataBase(); 
    // Call the service to validate the access code
    const result = await validateAndUseAccessCode(videoId, code, studentId);

    if (result.isValid) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result); // Return error message if invalid
    }
  } catch (error) {
    console.error("Error in AccessCodeController:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
  });  
  

  router.get('/accessCodes/:videoId', async (req, res) => {
    const { videoId } = req.params;
  
    try {
      const query = { videoId };
      await connectToDataBase();
  
      const accessCodes = await accessCodeModel.find(query).populate({
        path: 'codes.assignedTo',
        select: 'name email', // Select relevant fields of assigned students
      });
      
      res.status(200).json(accessCodes);
    } catch (error) {
      console.error('Error fetching access codes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }); 
//   // Fetch access codes for a specific video with optional filter
// router.get('/accessCodes/:videoId', async (req, res) => {
//   const { videoId } = req.params;
//   const { status } = req.query; // Filter by status (active, used, expired)

//   try {
//     const query = { videoId };
//     if (status) query['codes.status'] = status;
//     await connectToDataBase(); 

//     const accessCodes = await accessCodeModel.find(query).populate({
//       path: 'codes.assignedTo',
//       select: 'name email', // Select relevant fields of assigned students
//     });
//     res.status(200).json(accessCodes);
//   } catch (error) {
//     console.error('Error fetching access codes:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

  
  
  
  module.exports = router;