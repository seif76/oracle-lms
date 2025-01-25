"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminEditVideo = ({ show, handleClose, videoData, id, fetchVideos }) => {
  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    youtubeLink: "",
  });
  const [imagePreview, setImagePreview] = useState(""); // For displaying the current or new image
  const [newImage, setNewImage] = useState(null); // To store the new uploaded image

  // Sync formData with videoData when videoData changes
  useEffect(() => {
    if (videoData) {
        alert(JSON.stringify(videoData));
      setFormData({
        title: videoData.title || "",
        description: videoData.description || "",
        courseId: videoData.courseId || "",
        youtubeLink: videoData.youtubeLink || "",
      });

      if (videoData.image) {
        setImagePreview(videoData.image); // The image is expected to be a Base64 string
      } else {
        setImagePreview(""); // Clear the preview if no image exists
      }
    }
  }, [videoData]); // Re-run whenever videoData changes

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update video data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("courseId", formData.courseId);
      formDataToSend.append("youtubeLink", formData.youtubeLink);

      if (newImage) {
        formDataToSend.append("image", newImage); // Append the new image if uploaded
      }

      await axios.put(`/api/videos/updateVideoById/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchVideos(); // Fetch updated videos list
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error updating video", error);
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
        <h2 className="text-xl font-bold mb-4">Edit Video</h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              required
            />
          </div>

          {/* Course ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Course ID</label>
            <input
              type="text"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* YouTube Link */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">YouTube Link</label>
            <input
              type="url"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleChange}
              placeholder="Enter YouTube video link"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Image Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Video Thumbnail</label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Video Thumbnail"
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

export default AdminEditVideo;
