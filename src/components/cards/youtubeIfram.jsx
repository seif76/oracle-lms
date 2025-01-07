'use client';
import React, {useEffect , useState , useRef}from "react";
import axios from "axios";
import Head from "next/head";

function YoutubeIfram({
    url,
    title,
    category
}) {
   const IFRAME_URL = "https://www.youtube.com/embed/QvlcyoLp8x0?si=0kmlIz_3lH4oarE3&rel=0&modestbranding=1&autoplay=1"
   const IFRAME_URL2 = "https://www.youtube.com/embed/QvlcyoLp8x0?si=0kmlIz_3lH4oarE3&rel=0&showinfo=0&modestbranding=1&autoplay=1"
   const size = useWindowSize();
   const [currentWidth, setcurrentWidth] = useState(size.width - 280);
   const [currentheight, setcurrentheight] = useState("");
   const [isSimulatedFullscreen, setIsSimulatedFullscreen] = useState(false);

   const handleSimulatedFullscreen = () => {
     setIsSimulatedFullscreen((prevState) => !prevState);
   };
 
   
  useEffect(() => {
  
    console.log("the width is : " + size.width );
    console.log("the height is : " + size.height );
    if (size.width <= 680) {
    setcurrentWidth(size.width - 50 );
    setcurrentheight(size.height / 2.5);

    }else{
    setcurrentWidth(size.width - 450);
    setcurrentheight(size.height / 1.5);

      
    }

    console.log("the current width is : " + currentWidth );
    console.log("the height is : " + currentheight );

  }, [size]);
  const test = () => {
   return false;
  };

  return (
    <div>
    <iframe 
     id="iframe"
     width={currentWidth ||300} 
     height={currentheight ||200} 
     src={url} 
     title="YouTube video player" 
     frameBorder="0" 
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
     allowFullScreen
      
     sandbox="allow-presentation allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation"
     >
    </iframe>
     {
     // <h1>{size.width}px / {size.height}px</h1>
    }
    <div className="p-4 flex flex-col">
             <h2 className="text-2xl font-semibold mb-2">
               {title}
             </h2>
             <p className="text-l text-muted-foreground">
            {category}
            </p>
     </div>
  </div>
  )
}


function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
       
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }

export default YoutubeIfram