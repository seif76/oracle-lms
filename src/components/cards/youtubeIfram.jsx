'use client';
import React, { useEffect, useState, useRef } from "react";

function YoutubeIfram({
  url,
  title,
  category,
  phoneNumber,
}) {
  const size = useWindowSize();
  const iframeContainerRef = useRef(null);
  const [currentWidth, setCurrentWidth] = useState(size.width - 280);
  const [currentHeight, setCurrentHeight] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watermarkPosition, setWatermarkPosition] = useState({ top: 10, left: 10 });

  // Handle resizing
  useEffect(() => {
    if (!isFullscreen) {
      if (size.width <= 680) {
        setCurrentWidth(size.width - 50);
        setCurrentHeight(size.height / 2.5);
      } else {
        setCurrentWidth(size.width - 450);
        setCurrentHeight(size.height / 1.5);
      }
    }
  }, [size, isFullscreen]);

  // Move the watermark randomly inside the iframe
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPosition({
        top: Math.random() * (currentHeight - 30),
        left: Math.random() * (currentWidth - 100),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentWidth, currentHeight]);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div
      ref={iframeContainerRef}
      className={`relative ${isFullscreen ? "fullscreen-container" : ""}`}
      style={{
        width: isFullscreen ? "100vw" : `${currentWidth || 300}px`,
        height: isFullscreen ? "100vh" : `${currentHeight || 200}px`,
        transition: "all 0.3s ease-in-out",
      }}
    >
       {/* Transparent div to block interactions */}
       <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "20%", // Adjust height to cover the top portion
          background: "transparent", // Fully transparent
          zIndex: 5,
          pointerEvents: "auto", // Block user interactions in this area
        }}
      ></div>
      {/* YouTube iframe */}
      <iframe
        id="iframe"
        className="w-full h-full"
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        
        sandbox="allow-presentation allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation"
      ></iframe>

      {/* Watermark */}
      <div
        className="absolute text-white text-sm font-bold bg-black bg-opacity-50 p-1 rounded"
        style={{
          top: watermarkPosition.top,
          left: watermarkPosition.left,
          pointerEvents: "none",
        }}
      >
        {phoneNumber}
      </div>

      {/* Fullscreen toggle button */}
      <button
        className={` ${isFullscreen ? "px-5 py-2.5" : "px-6 py-2.5"} absolute bg-black text-white  text-xs rounded`}
        style={{
          bottom: 1,
          right: 8,
        }}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>

      {!isFullscreen && (
        <div className="p-4 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p className="text-l text-muted-foreground">{category}</p>
        </div>
      )}
    </div>
  );
}

// Custom hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

export default YoutubeIfram;
