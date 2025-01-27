"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherEditCourse = ({ show, handleClose, courseData, id ,fetchCourses }) => {
  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teacherId: "",
  });
  const [imagePreview, setImagePreview] = useState(""); // For displaying the current or new image
  const [newImage, setNewImage] = useState(null); // To store the new uploaded image


  // Sync formData with courseData when courseData changes
  useEffect(() => {
    if (courseData) {
        //alert(JSON.stringify(courseData.image));
        
      setFormData({
        title: courseData.title || "",
        description: courseData.description || "",
        teacherId: courseData.teacherId || "",
      });
      
      if (courseData.image && courseData.image.data) {
        setImagePreview(`data:${courseData.image.contentType};base64,${courseData.image.data.toString("base64")}`);
      } else {
        setImagePreview(""); // Clear the preview if no image exists
      }
    }
  }, [courseData]); // Re-run whenever courseData changes

  // Handle form field changes
  const handleChange = (e) => {
    const { title, value } = e.target;
    setFormData((prev) => ({ ...prev, [title]: value }));
  };

  // Handle form submission to update user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("teacherId", formData.teacherId);

      if (newImage) {
        formDataToSend.append("image", newImage); // Append the new image if uploaded
      }

      await axios.put(`/api/courses/updateCourseById/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchCourses(); // Fetch updated courses list
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error updating course", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 4 * 1024 * 1024) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show a preview of the selected image
    } else {
      alert("File size must be less than 4MB.");
    }
  };

  if (!show) return null; // Don't render if not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">Edit Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">title</label>
            <input
              type="text"
              title="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">description</label>
            <input
              type="description"
              title="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

           {/* Image Section */}
           <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Course Image</label>
            {imagePreview && (
              <img
                src={`${imagePreview}`}
                alt="Course"
                className="w-full h-40 object-cover rounded-md mt-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherEditCourse;
