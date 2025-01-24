const express = require("express");
const courseModel = require("../lib/course");
const teacherModel = require("../lib/teacher"); // Import teacher model
const connectToDataBase = require("../lib/mongodb");
const { uploadFile } = require('@uploadthing/react');  // Import Uploadthings file upload logic
const createBaseRouter = require("./baseController");

const router = express.Router();

// Base CRUD routes for courses
const baseRouter = createBaseRouter(courseModel);
router.use("/courses", baseRouter); // All base routes for /courses will be prefixed here

// Custom route to fetch all courses with teacher data manually (no populate)
router.get("/courses/get-courseand-teachername", async (req, res) => {
  try {
    await connectToDataBase(); // Ensure DB connection

    // Fetch all courses
    const courses = await courseModel.find({}).exec();

    // For each course, fetch teacher details separately
    const coursesWithTeachers = await Promise.all(
      courses.map(async (course) => {
        // Fetch teacher by teacherId
        const teacher = await teacherModel.findById(course.teacherId).exec();

        // Attach teacher name to course data, or set as "Unknown Teacher"
        const teacherName = teacher ? teacher.name : "Unknown Teacher";

        // Return the course data along with the teacher's name
        return {
          ...course.toObject(), // Convert the Mongoose object to plain JS object
          teacherName: teacherName, // Add the teacher's name
        };
      })
    );

    console.log("Courses with teacher data:", coursesWithTeachers); // Debugging log
    res.status(200).json(coursesWithTeachers); // Send courses with teacher names
  } catch (error) {
    console.error("Error fetching courses", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Route to create a new course with image upload
router.post("/courses", async (req, res) => {
  const { title, description, teacherId, imageUrl } = req.body;

  // Validate incoming data
  if (!title || !teacherId || !imageUrl) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await connectToDataBase(); // Ensure DB connection

    // Upload the image to Uploadthing (assuming imageUrl contains the file data)
    const uploadedImage = await uploadFile(imageUrl);  // Image is expected to be in the `imageUrl` field of the request body

    // If the upload is successful and returns an image URL
    if (uploadedImage?.url) {
      // Create a new course with the image URL from Uploadthings
      const newCourse = await courseModel.create({
        title,
        description,
        teacherId,
        imageUrl: uploadedImage.url, // Save the URL of the uploaded image from Uploadthing
      });

      res.status(201).json(newCourse); // Respond with the created course
    } else {
      res.status(500).json({ message: "Error uploading image" });  // If image upload fails
    }
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
