
const express = require('express')
const next = require('next')
const cors =  require("cors");
require('dotenv').config();

//const mainRouter = require("./src/pages/api/Routes/main")
//const lessonsRouter = require("./src/pages/api/lessons/getAllLessons")
//const authenticate = require("./src/pages/api/authinticate/authinticate")
//const studentsRouter = require("./src/pages/api/students/getStudent")
const studentsRouter = require("./src/controllers/studentController");

const seedData = require('./src/lib/seeder');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// database stuff

const mongoose = require("mongoose");
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
  
//   console.log("Connected successfully");

  
//   try {
//     // Run seeder here after the DB connection is established
//      seedData();
//     console.log('Seeding completed successfully.');
//   } catch (error) {
//     console.error('Error running seeder:', error);
//   }

// });

//const mongoURI = 'mongodb+srv://oraclelms56:nqEkz4QDJGm5kiVh@cluster0.v0xpf.mongodb.net/Oracle-lms?retryWrites=true&w=majority&appName=Cluster0';

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
         return seedData();
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

  //server.use("/api" ,mainRouter);
  //server.use("/api" ,authenticate);
  //server.use("/api" ,lessonsRouter);
  //server.use("/api" ,studentsRouter);
  server.use("/api" ,studentsRouter);

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