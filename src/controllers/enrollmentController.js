const express = require("express");
const enrollmentModel = require("../lib/enrollment");
const studentModel = require("../lib/student");
const connectToDataBase = require("../lib/mongodb");

const router = express.Router();

// Get enrollment details by student phone number
router.get("/enrollment-by-phone/:phoneNumber", async (req, res) => {
  try {
    await connectToDataBase(); // Ensure DB connection
    const { phoneNumber } = req.params;

    // Find the student with the given phone number
    const student = await studentModel.findOne({ phoneNumber });

    if (!student) {
      return res.status(404).json({ message: "Student not found with this phone number" });
    }

    // Fetch enrollment data for the student
    const enrollmentData = await enrollmentModel
      .findOne({ studentId: student._id })
      .populate("studentId", "name phoneNumber") // Populate student name and phone
      .populate("coursesEnrolled.courseId", "title description") // Populate course details
      .populate("videosWatched.videoId", "title description"); // Populate video details

    if (!enrollmentData) {
      return res.status(404).json({ message: "Enrollment data not found for this student" });
    }

    // Format the response
    const response = {
      student: {
        id: student._id,
        name: student.name,
        phoneNumber: student.phoneNumber,
      },
      courses: enrollmentData.coursesEnrolled.map((course) => ({
        id: course.courseId._id,
        title: course.courseId.title,
        description: course.courseId.description,
        enrolledAt: course.enrolledAt,
      })),
      videosWatched: enrollmentData.videosWatched.map((video) => ({
        id: video.videoId._id,
        title: video.videoId.title,
        description: video.videoId.description,
        watchedAt: video.watchedAt,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching enrollment by phone number:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;