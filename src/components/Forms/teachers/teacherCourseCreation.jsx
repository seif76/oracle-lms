"use client"

import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';

const TeacherCourseCreation = ({ onClose, onCourseCreated }) => {
    const [cookies, setCookie,removeCookie] = useCookies(['jwt']);
    const token = cookies.jwt;
    const decodedJwt = jwtDecode(token);
    const teacherId = decodedJwt.id;


  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    teacherId: teacherId,
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);

  // Handle input changes for course details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 4 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert("File size must be less than 4MB.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    //alert("the array is : " + JSON.stringify(courseData))
    setLoading(true);
    setErrorMessage("");

    try {
      // Send course data to the backend including the image URL
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("teacherId", courseData.teacherId);
      if (file) {
        formData.append("image", file); // Append the image file
      } else {
        throw new Error("Please select an image to upload.");
      }

      // Send POST request to backend
      const response = await axios.post("/api/newCourse", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct headers for file uploads
        },
      });

      if (response.status === 201) {
        onCourseCreated(response.data); // Notify parent of the new course
        setCourseData({ title: "", description: "", teacherId: "" });
        setFile(null); // Reset image URL after creation
        onClose(); // Close the modal or form
      } else {
        throw new Error("Course creation failed.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-600 font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={courseData.title}
          onChange={handleChange}
          placeholder="Enter course title"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={courseData.description}
          onChange={handleChange}
          placeholder="Enter course description"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          rows={3}
        />
      </div>

      

      <div>
        <label className="block text-gray-600 font-medium mb-1">Image</label>
        {/* UploadButton from Uploadthing */}
        <input type="file" accept="image/*" onChange={handleFileChange}   />
       
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <button
        type="submit"
        className={`w-full px-4 py-2 rounded-lg ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800"
        }`}
        disabled={loading}
      >
        {loading ? "Creating Course..." : "Create Course"}
      </button>
    </form>
  );
};

export default TeacherCourseCreation;
