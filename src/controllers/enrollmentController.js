const express = require("express");
const enrollmentModel = require("../lib/enrollment");
const studentModel = require("../lib/student");
const courseModel = require("../lib/course"); // Add course model for course linking
const videoModel = require("../lib/video"); // Add video model for video linking
const connectToDataBase = require("../lib/mongodb");

const router = express.Router();

// Get enrollment details by student phone number (unchanged)
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

// Post enrollment data based on student ID and video watched
router.post("/enroll-student", async (req, res) => {
  try {
    await connectToDataBase(); // Ensure DB connection
    const { studentId, videosWatched } = req.body; // Expect student ID and videosWatched array in the request body

    // Find the student by ID
    const student = await studentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Iterate over the videosWatched array
    for (const { videoId, watchedAt } of videosWatched) {
      // Find the video to get course information
      const video = await videoModel.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: `Video with ID ${videoId} not found` });
      }

      // Find the course associated with this video
      const course = await courseModel.findById(video.courseId);
      if (!course) {
        return res.status(404).json({ message: `Course for video ${videoId} not found` });
      }

      // Check if the student is already enrolled in this course
      let enrollment = await enrollmentModel.findOne({ studentId: student._id });

      // If no enrollment data exists, create a new enrollment document
      if (!enrollment) {
        enrollment = new enrollmentModel({
          studentId: student._id,
          coursesEnrolled: [
            {
              courseId: course._id,
              enrolledAt: new Date(),
            },
          ],
          videosWatched: [
            {
              videoId: video._id,
              watchedAt,
            },
          ],
        });
      } else {
        // Update the student's enrollment with the new course and video
        const courseExists = enrollment.coursesEnrolled.some(
          (courseEntry) => courseEntry.courseId.toString() === course._id.toString()
        );

        if (!courseExists) {
          enrollment.coursesEnrolled.push({
            courseId: course._id,
            enrolledAt: new Date(),
          });
        }

        const videoExists = enrollment.videosWatched.some(
          (videoEntry) => videoEntry.videoId.toString() === video._id.toString()
        );

        if (!videoExists) {
          enrollment.videosWatched.push({
            videoId: video._id,
            watchedAt,
          });
        }
      }

      // Save the enrollment
      await enrollment.save();
    }

    res.status(200).json({ message: "Student enrolled successfully for the provided videos" });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
