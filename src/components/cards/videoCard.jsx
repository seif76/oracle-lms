'use client'

import React, {useEffect , useState}from "react";
import axios from "axios";
import AccessCodesPopup from "../popups/student/AccessCodesPopup";

export default function VideoCard({videoId, urlToNavigate, title, category, imageUrl, duration }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition w-full">
      {/* Video Thumbnail */}
      <div className="w-full md:w-32 h-32 md:h-20 flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Video Info */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{category}</p>
        <p className="text-sm text-gray-500 mt-1">{duration}</p>
      </div>

      {/* Action Button */}
      <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Enroll
        </button>

        <AccessCodesPopup
        videoId={videoId}
        isOpen={isModalOpen}
        //onClose={() => setIsModalOpen(false)}
        setIsModalOpen={setIsModalOpen}
        urlToNavigate = {urlToNavigate}
        //onSubmit={(accessCode) => {
        //  handleAccessCodeSubmit(accessCode);
        //  setIsModalOpen(false); // Close the modal after submission
        //}}
      />
    </div>
  );
}
