
'use client'
import Image from "next/image";
import { useRouter,usePathname } from "next/navigation";
import NavLayout from "@/components/navigation/navLayout";
import CourseCard from "@/components/cards/courseCard";
import CategoryCard from "@/components/cards/categoryCard";
import React, {useEffect , useState}from "react";
import axios from "axios";

export default function video({searchquery}) {
    //const router = useRouter();

    const pathname = usePathname();
    const [videos, setVideos] = useState([]);
    // this useEffect handles all courses data once the page is loaded

    const [filteredVideos, setFilteredVideos] = useState([]);
    

    const extractLastUrl = (fullUrl) => {
      const segments = fullUrl.split('/');
      const last = segments[segments.length - 1] || segments[segments.length - 2];
      
      return last
      // console.log("the cat is : "+ category);
    };

    useEffect(() => {
      //alert("path is : "+pathname);
      
      //alert("path is : "+extractLastUrl(pathname));

      const courseId = extractLastUrl(pathname);
      axios.get(`/api/videos/course/${courseId}` ).then(function(response) {
 
        setVideos(response.data);
        setFilteredVideos(response.data);
        //alert("the array is : " + JSON.stringify(response.data))
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

    return (
       <div>
        <div  className="flex items-center gap-x-2 overflow-x-auto pb-2">
          {categories.map((category,index) => (
            <CategoryCard 
              key={index}
              category={category}
              activeCategory={Activecategory}
              handleCategory={handleCategory}
            />
            ))}
          </div>

        <div className="grid sm:mt-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
         {filteredVideos.map((video) => (
           <CourseCard
             key={video._id}
             id={"video/"+video._id}
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
