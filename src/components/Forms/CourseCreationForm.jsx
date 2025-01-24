import React, { useState } from "react";
import axios from "axios";
import { UploadButton } from "@uploadthing/react";
//import { UploadButton } from "~/utils/uploadthing"; // Import UploadButton

const CourseCreationForm = ({ onClose, onCourseCreated }) => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    teacherId: "",
  });
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes for course details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  // Handle image upload completion
  const handleUploadComplete = (files) => {
    if (files && files.length > 0) {
      setImageFileUrl(files[0].url); // Set the uploaded image URL
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFileUrl) {
      setErrorMessage("Please upload an image.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Send course data to the backend including the image URL
      const response = await axios.post("/api/courses", {
        ...courseData,
        imageUrl: imageFileUrl, // Include the image URL
      });

      if (response.status === 201) {
        onCourseCreated(response.data); // Notify parent of the new course
        setCourseData({ title: "", description: "", teacherId: "" });
        setImageFileUrl(null); // Reset image URL after creation
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
        <label className="block text-gray-600 font-medium mb-1">Teacher ID</label>
        <input
          type="text"
          name="teacherId"
          value={courseData.teacherId}
          onChange={handleChange}
          placeholder="Enter teacher ID"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Image</label>
        {/* UploadButton from Uploadthing */}
        <div className="upload-btn-container">
          <UploadButton
            endpoint="/api/uploadthing"
            onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                alert("Upload Completed");
              }}
            onUploadError={(error) => {
              alert(`ERROR! ${error.message}`);
            }}
            style={{
              backgroundColor: "#4CAF50", // You can modify the button color
              color: "white", // Set the text color
              padding: "10px 20px", // Add padding
              borderRadius: "5px", // Round the corners
              border: "none", // Remove border
              cursor: "pointer", // Change cursor to pointer on hover
            }}
          />
            
        </div>
        {imageFileUrl && (
          <p className="text-green-500">Image uploaded successfully!</p>
        )}
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

export default CourseCreationForm;
