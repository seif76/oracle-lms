import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import VideoCreationForm from "../../Forms/videoCreationForm";
import AdminEditvideo from "@/components/popups/admin/AdminEditvideo";

import { useCookies } from 'react-cookie';
import { jwtDecode } from "jwt-decode";


const TeacherVideosDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [filter, setFilter] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedvideo, setSelectedvideo] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const [cookies, setCookie,removeCookie] = useCookies(['jwt']);
  const token = cookies.jwt;

  const fetchvideos = async () => {
    try {
      const decodedJwt = jwtDecode(token);
      const teacherId = decodedJwt.id;
      setLoading(true); // Set loading to true while fetching data
      const response = await axios.get(`/api/videos/videos-by-teacher/${teacherId}`);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handlevideoCreated = (newvideo) => {
    setVideos((prevvideos) => [...prevvideos, newvideo]);
  };

  const deletevideo = async (videoId) => {
    try {
      await axios.delete(`/api/videos/deleteVideoById/${videoId}`);
      fetchvideos(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting video", error);
    }
  };

  const handleEditClick = (VideoData) => {
    setSelectedId(VideoData._id);
    setSelectedvideo(VideoData);
    setEditModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    fetchvideos();
  }, []);

  const filteredvideos = videos.filter(
    (video) =>
      video.title?.toLowerCase().includes(filter.toLowerCase()) ||
      video.description?.toLowerCase().includes(filter.toLowerCase()) ||
      video.courseName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">video Management</h1>

      {/* Filter and Add video Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Filter by title, description, or Course name"
          className="border p-2 w-[48%]"
          value={filter}
          onChange={handleFilterChange}
        />
        <button
          onClick={() => setAddModalOpen(true)}
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Add video
        </button>
      </div>

      {/* videos Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Course Name</th>
            <th className="border p-2">Youtube Link</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? ( // Show loading indicator while data is being fetched
            <tr>
              <td colSpan="5" className="text-center p-4">
                Loading videos...
              </td>
            </tr>
          ) : (
            filteredvideos.map((video) => (
              <tr key={video._id}>
                <td className="border p-2">{video.title}</td>
                <td className="border p-2">{video.description || "N/A"}</td>
                <td className="border p-2">{video.courseName || "Unknown Course"}</td>
                <td className="border p-2">{video.youtubeLink || "Unknown youtubeLink"}</td>    
                <td className="border p-2">{new Date(video.createdAt).toLocaleDateString()}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick({ ...video })}
                    className="text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deletevideo(video._id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Add video */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold mb-4">Add New video</h2>
            <button
          onClick={() => setAddModalOpen(false)}
          className="text-gray-500  hover:text-gray-800"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          
        </button>
        </div>
            <VideoCreationForm
              onClose={() => setAddModalOpen(false)}
              onVideoCreated={handlevideoCreated}
            />
          </div>
        </div>
      )}

      {/* Modal for Edit video */}
      <AdminEditvideo
        show={isEditModalOpen}
        handleClose={() => setEditModalOpen(false)}
        videoData={selectedvideo}
        id={selectedId}
        fetchVideos={fetchvideos}
      />
    </div>
  );
};

export default TeacherVideosDashboard;



