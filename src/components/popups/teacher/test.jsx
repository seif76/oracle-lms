"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const TeacherEditVideo = ({ show, handleClose, videoData, id, fetchVideos, teacherId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    youtubeLink: "",
  });
  const [imagePreview, setImagePreview] = useState(""); // For displaying the current or new image
  const [newImage, setNewImage] = useState(null); // To store the new uploaded image
  const [numberOfCodes, setNumberOfCodes] = useState("");
  const [courses, setCourses] = useState([]); // List of courses

  const router = useRouter();

  // Fetch courses for the teacher
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/courses/by-teacher/${teacherId}`);
        setCourses(response.data); // Populate the courses dropdown
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (teacherId) fetchCourses();
  }, [teacherId]);

  // Sync formData with videoData when videoData changes
  useEffect(() => {
    if (videoData) {
      setFormData({
        title: videoData.title || "",
        description: videoData.description || "",
        courseId: videoData.courseId || "",
        youtubeLink: videoData.youtubeLink || "",
      });
      setNumberOfCodes("");

      if (videoData.image) {
        setImagePreview(videoData.image); // The image is expected to be a Base64 string
      } else {
        setImagePreview(""); // Clear the preview if no image exists
      }
    }
  }, [videoData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsPage = () => {
    router.push(`/teacher/video/${id}`);
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
      formDataToSend.append("numberOfCodes", numberOfCodes);

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

  // Handle numberOfCodes change
  const handleCodesChange = (e) => {
    setNumberOfCodes(e.target.value);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Video</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
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
            <div className="md:col-span-2">
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

            {/* Course Name Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <select
  name="courseId"
  value={formData.courseId}
  onChange={handleChange}
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  required
>
  <option value="" disabled>
    Select a course
  </option>
  {courses.map((course) => (
    <option key={course.id} value={course.id}>
      {course.name}
    </option>
  ))}
</select>
            </div>

            {/* YouTube Link */}
            <div>
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

            {/* Access Codes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Generate More Access Codes</label>
              <input
                type="number"
                name="numberOfCodes"
                value={numberOfCodes}
                onChange={handleCodesChange}
                placeholder="Enter number of access codes"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleDetailsPage}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-indigo-700"
              >
                See All Video Details
              </button>
            </div>

            {/* Image Section */}
            <div>
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
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-gray-600 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-indigo-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherEditVideo;
