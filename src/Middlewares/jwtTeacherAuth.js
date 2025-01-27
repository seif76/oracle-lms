const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// Helper function to verify JWT and check role
const cookieJwtAuth = (token) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the role is 'teacher'
    if (decoded && decoded.role == 'teacher') {
      return true;
    }

    return false;
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return false;
  }
};


// Middleware to authenticate and check role
router.use("/jwtTeacherAuth", (req, res, next) => {
  const token = req.headers.jwt;

  // Validate the token and role
  //console.log("authantication in middware :" +  cookieJwtAuth(token))
  if (cookieJwtAuth(token)) {
    res.json({ authenticate: true });
    next(); // Proceed to the next middleware or route
  } else {
    res.status(403).json({ authenticate: false, message: "Unauthorized access" });
    console.log("Not authorized");
  }
});

module.exports = router;
