const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;


require('dotenv').config();


const cookieJwtAuth = (token) => {
  
    // var decoded = jwt.verify(token, process.env.JWT_SECRET );

    // if (decoded) {
    //   return true;
    // }else{
    //   return false ;
    // }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         // Attach decoded token data to request object
         if (decoded) {
               return true;
             }
        next(); // Proceed to the next middleware or route
      } catch (error) {
       
        return false ;
      }


};

router.use("/jwtAuth",(req,res,next) => {
 
   const token = req.headers.jwt ; 
   
  // console.log(" authantication returned : "+ cookieJwtAuth(token));
     
    if (cookieJwtAuth(token) == true) {
    
       res.json({ authinticate: true})
       next();
     
    } else {
     res.json({ authinticate: false})
     console.log("not authhhhhh")
    }
    
    


   })


module.exports = router;