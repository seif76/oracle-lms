const express = require("express");
const studentModel = require("../lib/student");
const createBaseRouter = require("./baseController");
const connectToDataBase  = require("../lib/mongodb");

const router = express.Router();

// Base CRUD routes
const baseRouter = createBaseRouter(studentModel);
router.use("/students", baseRouter);

router.get("/students/test", async function (req,res) {
  
    try {
        
      
      //const lessons = ["ssss","adfadf"];

       res.status(200).send({message:" hellooo"}) 
      
     } 
      catch (error) {
       // return logic here
       console.log(error);
        res.status(400).send("errorr")   
      }

      
   })




module.exports = router;