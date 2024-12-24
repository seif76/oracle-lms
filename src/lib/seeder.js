const mongoose = require('mongoose');
const { Types } = mongoose;
const Student = require('./student');
const Teacher = require('./teacher');
const Admin = require('./admin');
const Course = require('./course');
const Video = require('./video');
const Enrollment = require('./enrollment');
const AccessCode = require('./accessCode');

//const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://oraclelms56:nqEkz4QDJGm5kiVh@cluster0.v0xpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//const mongoURI = 'mongodb+srv://oraclelms56:nqEkz4QDJGm5kiVh@cluster0.v0xpf.mongodb.net/Oracle-lms?retryWrites=true&w=majority&appName=Cluster0' ;

const mongoURI = process.env.MONGODB_URI ;


// MongoDB Connection
 mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
})
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

const teacher1Id = new mongoose.Types.ObjectId();
const teacher2Id = new mongoose.Types.ObjectId();

const seedData = async () => {
    try {
        // Wait for connection to be established
        if (mongoose.connection.readyState !== 1) {
            console.log('Waiting for database connection...');
            await mongoose.connection.asPromise();
        }

        console.log('Connected to the database. Seeding data...');
        // Clear existing data
        await Promise.all([
            Student.deleteMany({}),
            Teacher.deleteMany({}),
            Admin.deleteMany({}),
            Course.deleteMany({}),
            Video.deleteMany({}),
            Enrollment.deleteMany({}),
            AccessCode.deleteMany({})
        ]);

        // Seed Students
        const students = [
            { name: 'John Doe', email: 'john@example.com', password: 'password123', phoneNumber: '1234567890', role: 'student', devices: ['device1', 'device2'] },
            { name: 'Jane Smith', email: 'jane@example.com', password: 'password456', phoneNumber: '0987654321', role: 'student', devices: ['device3'] },
        ];
        const insertedStudents = await Student.insertMany(students);

        // Seed Teachers
        const teachers = [
            { _id: teacher1Id, name: 'Mr. Anderson', email: 'anderson@example.com', password: 'teach123', phoneNumber: '1122334455', subjects: ['Math', 'Physics'] },
            { _id: teacher2Id, name: 'Ms. Davis', email: 'davis@example.com', password: 'teach456', phoneNumber: '5566778899', subjects: ['English', 'History'] },
        ];
        await Teacher.insertMany(teachers);

        // Seed Admins
        const admins = [
            { name: 'Admin One', email: 'admin111@example.com', password: 'admin123', phoneNumber: '2233445566', permissions: ['all'] },
            { name: 'Admin Two', email: 'admin2@example.com', password: 'admin456', phoneNumber: '6677889900', permissions: ['limited'] },
        ];
        await Admin.insertMany(admins);

        // Seed Courses
        const courses = [
            { title: 'Introduction to Math', description: 'Basic Math Concepts', teacherId: teacher1Id },
            { title: 'History 101', description: 'World History Overview', teacherId: teacher2Id },
        ];
        const insertedCourses = await Course.insertMany(courses);

        // Seed Videos (using inserted course IDs)
        const videos = [
            { courseId: insertedCourses[0]._id, title: 'Math Basics', description: 'Learn the basics of math', youtubeLink: 'https://youtube.com/video1' },
            { courseId: insertedCourses[1]._id, title: 'World Wars', description: 'A brief overview of the World Wars', youtubeLink: 'https://youtube.com/video2' },
        ];
        const insertedVideos = await Video.insertMany(videos);

        // Seed Enrollments
        const enrollments = [
            { studentId: insertedStudents[0]._id, courseId: insertedCourses[0]._id, enrolledAt: new Date() },
            { studentId: insertedStudents[1]._id, courseId: insertedCourses[1]._id, enrolledAt: new Date() },
        ];
        await Enrollment.insertMany(enrollments);

        // Seed Access Codes
        const accessCodes = [
            { videoId: insertedVideos[0]._id, code: 'CODE123', status: 'active' },
            { videoId: insertedVideos[1]._id, code: 'CODE456', status: 'active' },
        ];
        await AccessCode.insertMany(accessCodes);

        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};




  module.exports = seedData;