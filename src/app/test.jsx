
'use client'
import Image from "next/image";
import { useRouter,usePathname,useSearchParams } from "next/navigation";
import NavLayout from "@/components/navigation/navLayout";
import CourseCard from "@/components/cards/courseCard";
import CategoryCard from "@/components/cards/categoryCard";
import React, {useEffect , useState}from "react";
import axios from "axios";

export default function Home({ searchquery }) {
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()
   
    const categories = ["All","Arabic","Maths","Physics","English","Science","French","Biology"];
    const [courses, setCourses] = useState([]);
    const [Activecategory, setActiveCategory] = useState("");
    const [filtered, setFilteredCourses] = useState([]);
    const [query, setQuery] = useState(searchquery);


    // this useEffect handles all courses data once the page is loaded
    useEffect(() => {
      axios.get('/api/courses/' ).then(function(response) {
 
        setCourses(response.data);
        setFilteredCourses(response.data);
        //alert("the array is : " + JSON.stringify(response.data))
      }).catch(function(error) {
        console.log(error);
           
      });
    }, []);

    useEffect(() => {
      // Filter courses based on search query
      //alert("word is : "+ searchquery ); 
      // const filtered = courses.filter((course) =>
      // makeLowerCase(course.title).includes(makeLowerCase(searchquery))
      // );
      // setFilteredCourses(filtered);
    }, [searchquery]);

    // those arrays are for testing purposes and will be removed soon 
    
    const handleCategory = (category) => {
      setActiveCategory(category)
    };
    const makeLowerCase = (string) => {

      return string?.toString().toLowerCase() 
      
    }
    
    const filteredLessons = [
      {
      _id: "123456",
      title: "Introduction to React",
      category: "Web Development",
      bgImage: "/testlms.PNG", // You can use any image URL
      duration: "2 hours"
     },
     {
      _id: "12345996",
      title: "Introduction to laravel",
      category: "Web Development",
      bgImage: "/testlms.PNG", // You can use any image URL
      duration: "1 hours"
     }
    ];

    
    return (
      <NavLayout>
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
         {courses.map((course) => (
           <CourseCard
             key={course._id}
             id={course._id}
             title={course.title}
             category={"course.category"}
             imageUrl={"/testlms.PNG"}
             duration={"course.duration"}
            />
          ))}
       </div>

      </div>

      </NavLayout>
  );
}
