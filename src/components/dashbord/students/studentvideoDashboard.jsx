
'use client'
import Image from "next/image";
import { useRouter,usePathname } from "next/navigation";
import NavLayout from "@/components/navigation/navLayout";
import CourseCard from "@/components/cards/courseCard";
import CategoryCard from "@/components/cards/categoryCard";
import React, {useEffect , useState}from "react";
import axios from "axios";
import VideoCard from "../../cards/videoCard";
import CourseBanner from "../../cards/courseBanner";

export default function video({searchquery}) {
    //const router = useRouter();

    const pathname = usePathname();
    const [videos, setVideos] = useState([]);
    const [Course, setCourse] = useState([]);
    const [Teacher, setTeacher] = useState([]);
    // this useEffect handles all courses data once the page is loaded

    const [filteredVideos, setFilteredVideos] = useState([]);
    

    const extractLastUrl = (fullUrl) => {
      const segments = fullUrl.split('/');
      const last = segments[segments.length - 1] || segments[segments.length - 2];
      
      return last
      // console.log("the cat is : "+ category);
    };

    useEffect(() => {

      const courseId = extractLastUrl(pathname);
      axios.get(`/api/videos/course/${courseId}` ).then(function(response) {
        setCourse(response.data.Course)
        setVideos(response.data.videos);
        setFilteredVideos(response.data.videos);
        setTeacher(response.data.Teacher)
        //alert("the array is : " + JSON.stringify(response.data.Teacher))
      }).catch(function(error) {
        console.log(error);
           
      });
    }, []);

    useEffect(() => {
        //alert("Search query received in Home: " + searchquery); // Debugging
        if (searchquery) {
          const array = videos.filter((course) =>
            course.title.toLowerCase().includes(searchquery.toLowerCase())
          );
          
          setFilteredVideos(array);
        } else {
            setFilteredVideos(videos); // Reset if no query
        }
      }, [searchquery]);

    

    // those arrays are for testing purposes and will be removed soon 
    const [Activecategory, setActiveCategory] = useState("");
    const handleCategory = (category) => {
      setActiveCategory(category)
    };
    

    const categories = ["All","Arabic","Maths","Physics","English","Science","French","Biology"]
    // /testlms.PNG
    return (
       <div>
         <CourseBanner
        title={Course?.title || "loading..." }
        description={Course?.description || "loading..."}
        teacherName={Teacher?.name || "loading..."}
        bannerImageUrl={ "/testlms.PNG"}
      />
        

        <div className="flex flex-col gap-4 mt-4">
         {filteredVideos?.map((video) => (
           /*<CourseCard
             key={video._id}
             id={"video/"+video._id}
             title={video.title}
             category={"course.category"}
             imageUrl={"/testlms.PNG"}
             duration={"course.duration"}
            />*/
            <VideoCard
             key={video._id}
             videoId={video._id}
             urlToNavigate={"video/"+video._id}
             title={video.title}
             category={"course.category"}
             imageUrl={"/testlms.PNG"}
             duration={"course.duration"}
            />
            
          ))}
       </div>

      </div>

  );
}
