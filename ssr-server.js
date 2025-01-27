
const express = require('express')
const next = require('next')
const cors =  require("cors");
require('dotenv').config();

//const mainRouter = require("./src/pages/api/Routes/main")
const studentsRouter = require("./src/controllers/studentController");
const authRouter = require("./src/controllers/auth/authController");
const teacherRouter = require("./src/controllers/teacherController")
const videoRouter = require("./src/controllers/videoController")
const adminRouter = require("./src/controllers/adminController")
const coursesRouter = require("./src/controllers/courseController")
const enrollmentRouter = require("./src/controllers/enrollmentController")
const accessCodesRouter = require("./src/controllers/accessCodes")
const usersRouter =  require("./src/controllers/usersController")
const authAdminRouter = require("./src/controllers/auth/authAdminController");
const jwtAuth = require("./src/Middlewares/jwtAuth");
const analyticsRouter = require("./src/controllers/analyticsController")
const seedData = require('./src/lib/seeder');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// database stuff

const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI ;


// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
})
    .then(() => {
        console.log("Connected successfully to MongoDB");

        // Run seeder here after successful connection
       // return seedData();
    })
    .then(() => {
        console.log('Seeding completed successfully.');
    })
    .catch(err => {
        console.error('Error during connection or seeding:', err);
    })
    .finally(() => {
        // Close the connection after seeding or if there's an error
        mongoose.connection.close();
    });

const db = mongoose.connection;

// Extra error handling for unexpected connection issues
db.on("error", console.error.bind(console, "MongoDB connection error:"));


const fs = require("fs");



app.prepare()
.then(() => {
  const server = express()
  server.use(cors());

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use("/api" ,studentsRouter);
  server.use("/api/auth" ,authRouter);
  server.use("/api",videoRouter)
  server.use("/api",teacherRouter)
  server.use("/api",adminRouter)
  server.use("/api",coursesRouter)
  server.use("/api",enrollmentRouter)
  server.use("/api",accessCodesRouter)
  
  server.use("/api/auth",jwtAuth) 
  server.use("/api",usersRouter)
  server.use("/api/auth/admin",authAdminRouter)
  server.use("/api",analyticsRouter)

  
  
  server.use("/api", teacherRouter)
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})