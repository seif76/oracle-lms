const express = require('express');
const Enrollment = require('../lib/enrollment');
const Student = require('../lib/student');
const Video = require('../lib/video');
const Course = require('../lib/course');
const connectToDataBase  = require("../lib/mongodb");


const router = express.Router();

router.get('/admin/analytics', async (req, res) => {
  try {
    // Ensure the database connection is established
    await connectToDataBase();

    // Fetch analytics data
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    const enrollmentStats = await Enrollment.aggregate([
      { $unwind: '$coursesEnrolled' },
      {
        $group: {
          _id: '$coursesEnrolled.courseId',
          enrollmentCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },
      {
        $project: {
          _id: 0,
          courseTitle: '$course.title',
          enrollmentCount: 1,
        },
      },
    ]);

    res.status(200).json({
      totalStudents,
      totalCourses,
      totalVideos,
      totalEnrollments,
      enrollmentStats,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({
      message: 'Failed to fetch analytics data',
      error: error.message,
    });
  }
});

module.exports = router;
