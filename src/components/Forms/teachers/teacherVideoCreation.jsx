"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherVideoCreation = ({ teacherId, onClose, onVideoCreated }) => {
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    courseId: "",
    youtubeLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]); // To store courses for the teacher

  // Fetch courses for the teacher on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/courses/by-teacher/${teacherId}`);
        if (response.status === 200) {
          setCourses(response.data); // Update courses state
        } else {
          throw new Error("Failed to fetch courses");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || error.message);
      }
    };

    fetchCourses();
  }, [teacherId]);

  // Handle input changes for video details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoData({ ...videoData, [name]: value });
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
    setLoading(true);
    setErrorMessage("");

    try {
      // Create FormData to handle the file upload
      const formData = new FormData();
      formData.append("title", videoData.title);
      formData.append("description", videoData.description);
      formData.append("courseId", videoData.courseId);
      formData.append("youtubeLink", videoData.youtubeLink);
      if (file) {
        formData.append("image", file); // Append the image file
      } else {
        throw new Error("Please select an image to upload.");
      }

      // Send POST request to backend
      const response = await axios.post("/api/newVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct headers for file uploads
        },
      });

      if (response.status === 201) {
        onVideoCreated(response.data); // Notify parent of the new video
        setVideoData({ title: "", description: "", courseId: "", youtubeLink: "" });
        setFile(null); // Reset image after creation
        onClose(); // Close the modal or form
      } else {
        throw new Error("Video creation failed.");
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
          value={videoData.title}
          onChange={handleChange}
          placeholder="Enter video title"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={videoData.description}
          onChange={handleChange}
          placeholder="Enter video description"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Course</label>
        <select
          name="courseId"
          value={videoData.courseId}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        >
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">YouTube Link</label>
        <input
          type="url"
          name="youtubeLink"
          value={videoData.youtubeLink}
          onChange={handleChange}
          placeholder="Enter YouTube video link"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
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
        {loading ? "Creating Video..." : "Create Video"}
      </button>
    </form>
  );
};

export default TeacherVideoCreation;
