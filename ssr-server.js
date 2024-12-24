const express = require('express')
const next = require('next')
const cors =  require("cors");

//const mainRouter = require("./src/pages/api/Routes/main")
//const lessonsRouter = require("./src/pages/api/lessons/getAllLessons")
//const authenticate = require("./src/pages/api/authinticate/authinticate")
//const studentsRouter = require("./src/pages/api/students/getStudent")


const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// database stuff

const mongoose = require("mongoose");

//mongoose.connect('mongodb://127.0.0.1:27017/edusphere', {useNewUrlParser: true, });
mongoose.connect('mongodb+srv://oraclelms56:nqEkz4QDJGm5kiVh@cluster0.v0xpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// const userSchema = new mongoose.Schema ({
//   _id : Number,
//   username:String ,
//   password:String,
//   grade: Number 

// },{
//   versionKey: false // You should be aware of the outcome after set to false
// })

// const User = mongoose.model("student", userSchema);

// const user = new User ({
//   id:17,
//   username:"gamed",
//   password:"p@ssword",
//   grade : 12
// });

//  user.save(); 
//const user = new User ({
 // id:5,
//  name:"seconf seif",
//  grade : 11
//});

//user.save(); 
const fs = require("fs");


app.prepare()
.then(() => {
  const server = express()
  server.use(cors());

  //server.use("/api" ,mainRouter);
  //server.use("/api" ,authenticate);
  //server.use("/api" ,lessonsRouter);
  //server.use("/api" ,studentsRouter);

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