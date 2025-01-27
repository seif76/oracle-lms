const express = require("express");
const courseModel = require("../lib/course");
const teacherModel = require("../lib/teacher"); // Import teacher model
const connectToDataBase = require("../lib/mongodb");  
const createBaseRouter = require("./baseController");

const multer = require("multer");

const router = express.Router();

// Base CRUD routes for courses
const baseRouter = createBaseRouter(courseModel);
router.use("/courses", baseRouter); // All base routes for /courses will be prefixed here


// start multer setup

// Multer configuration for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // Limit file size to 4MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept only image files
    } else {
      cb(new Error("Only image files are allowed"), false); // Reject non-image files
    }
  },
});

// End multer setup


// Route to get all courses but with images
router.get("/courses-with-images", async (req, res) => {
  try {
    await connectToDataBase(); // Ensure DB connection
    const courses = await courseModel.find({}).exec();

    // Transform the response to include Base64-encoded images
    const transformedCourses = courses.map((course) => {
      const imageExists = course.image && course.image.data && course.image.contentType;
      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        teacherId: course.teacherId,
        createdAt: course.createdAt,
        image: imageExists
          ? `data:${course.image.contentType};base64,${course.image.data.toString("base64")}`
          : null, // If no image, send null
      };
    });

    res.status(200).json(transformedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});






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

    //console.log("Courses with teacher data:", coursesWithTeachers); // Debugging log
    res.status(200).json(coursesWithTeachers); // Send courses with teacher names
  } catch (error) {
    console.error("Error fetching courses", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});


// Route to create a new course with an uploaded image
router.post("/newCourse", upload.single("image"), async (req, res) => {
  
  const { title, description, teacherId } = req.body;
  console.log("title:" + title + "teacherId:" + teacherId )
  const file = req.file; // The uploaded image file

  // Validate incoming data
  if (!title || !teacherId || !file) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Ensure the database connection
    await connectToDataBase();

    // Create a new course with the uploaded image data
    const newCourse = await courseModel.create({
      title,
      description,
      teacherId,
      image: {
        data: file.buffer, // Store the binary data of the image
        contentType: file.mimetype, // Store the MIME type of the image
      },
    });

    // Respond with the created course
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/courses/updateCourseById/:id", upload.single("image"), async (req, res) => {
  try {
    await connectToDataBase();

    const { title, description, teacherId } = req.body;
    const file = req.file; // The uploaded image file

    // Find the course to update
    const course = await courseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update fields only if they are provided
    if (title) course.title = title;
    if (description) course.description = description;
    if (teacherId) course.teacherId = teacherId;

    // If a new image is uploaded, replace the existing one
    if (file) {
      course.image = {
        data: file.buffer,
        contentType: file.mimetype,
      };
    }

    // Save the updated course
    const updatedCourse = await course.save();

    // Respond with the updated course, including the image in Base64 format
    res.status(200).json({
      _id: updatedCourse._id,
      title: updatedCourse.title,
      description: updatedCourse.description,
      teacherId: updatedCourse.teacherId,
      createdAt: updatedCourse.createdAt,
      image: updatedCourse.image
        ? `data:${updatedCourse.image.contentType};base64,${updatedCourse.image.data.toString("base64")}`
        : null,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// start teacher specific methods

// get courses with teacher Id asigned
router.get("/courses/getCourses/:teacherId", async (req, res) => {
  const { teacherId } = req.params; // Get teacherId from the URL parameter

  try {
    await connectToDataBase(); // Ensure DB connection

   
   
    const courses = await courseModel.find({ teacherId }).exec();
    

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

    res.status(200).json(coursesWithTeachers); // Send courses with teacher names
  } catch (error) {
    console.error("Error fetching courses", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// this is for the api for the dropdown menu for the teacher videos dashboard page
router.get("/courses/by-teacher/:teacherId", async (req, res) => {
  const { teacherId } = req.params;

  try {
    const courses = await courseModel.find({ teacherId });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses for teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// End teacher specific methods

module.exports = router;
