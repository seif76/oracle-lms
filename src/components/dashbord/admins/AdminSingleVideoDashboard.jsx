"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoDetails from "@/components/video/VideoDetails";
import AccessCodeTable from "@/components/video/AccessCodeTable";
import { usePathname } from "next/navigation";

const SingleVideoPage = () => {
  const [video, setVideo] = useState(null);
  const [allAccessCodes, setAllAccessCodes] = useState([]); // Store all codes
  const [filteredAccessCodes, setFilteredAccessCodes] = useState([]); // Store filtered codes
  const [filter, setFilter] = useState(""); // "active", "used", "expired"
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Extract the last segment of the URL
  const extractLastUrl = (fullUrl) => {
    const segments = fullUrl.split("/");
    return segments[segments.length - 1] || segments[segments.length - 2];
  };

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const videoId = extractLastUrl(pathname);
      try {
        setLoading(true);

        // Fetch video details
        const videoResponse = await axios.get(`/api/vidoes/video/${videoId}`);
        setVideo(videoResponse.data);

        // Fetch all access codes for the video
        const accessCodeResponse = await axios.get(`/api/accessCodes/${videoId}`);
        setAllAccessCodes(accessCodeResponse.data); // Store all codes
        setFilteredAccessCodes(accessCodeResponse.data); // Initially, show all codes
      } catch (error) {
        console.error("Error fetching video details or access codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [pathname]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Video Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {video && <VideoDetails video={video} />}
          <AccessCodeTable
            accessCodes={filteredAccessCodes} // Pass filtered codes to the table
            filter={filter}
            onFilterChange={setFilter} // Update the filter state
          />
        </>
      )}
    </div>
  );
};

export default SingleVideoPage;
