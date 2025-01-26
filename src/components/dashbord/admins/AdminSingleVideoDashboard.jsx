"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoDetails from "@/components/video/VideoDetails";
import AccessCodeTable from "@/components/video/AccessCodeTable";
import { usePathname } from "next/navigation";

const SingleVideoPage = () => {
  const [video, setVideo] = useState(null);
  const [accessCodes, setAccessCodes] = useState([]);
  const [filter, setFilter] = useState(""); // "active", "used", "expired"
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  
  const extractLastUrl = (fullUrl) => {
    const segments = fullUrl.split('/');
    const last = segments[segments.length - 1] || segments[segments.length - 2];
    
    return last
    // console.log("the cat is : "+ category);
  };

  useEffect(() => {
    const fetchVideoDetails = async () => {
        const videoId = extractLastUrl(pathname);
      try {
        setLoading(true);
        const videoResponse = await axios.get(`/api/vidoes/video/${videoId}`);
        setVideo(videoResponse.data); 
        fetchAccessCodes(); // Fetch codes after video
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    const fetchAccessCodes = async () => {
        const videoId = extractLastUrl(pathname);
      try {
        const accessCodeResponse = await axios.get(`/api/accessCodes/${videoId}`, {
          params: { status: filter },
        });
        setAccessCodes(accessCodeResponse.data);
      } catch (error) {
        console.error("Error fetching access codes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [filter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Video Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {video && <VideoDetails video={video} />}
          <AccessCodeTable
            accessCodes={accessCodes}
            filter={filter}
            onFilterChange={setFilter}
          />
        </>
      )}
    </div>
  );
};

export default SingleVideoPage;
