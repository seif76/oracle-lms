'use client'
import React, {useEffect , useState}from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie';
import TeacherNavLayout from "@/components/navigation/teacherNavigation/teacherNavLayout";
//import NavLayout from "@/components/navigation/adminNavigation/adminNavLayout";
import LazyLoad from "@/components/loading/lazyLoading";
import TeacherProfile from "@/components/profiles/teacherProfile";
//import AdminUserDashboard from "@/components/dashbord/admins/adminUsersDashboard";
export default function Dashboard() {
  
    const [cookies, setCookie,removeCookie] = useCookies(['jwt']);
    const router = useRouter() ;
    //const [authinticate, setAuthinticate] = useState(false);
    const [authinticate, setAuthinticate] = useState(true);
  
  
    useEffect(() => {
  
  
      if (cookies.jwt) {
          axios.get('/api/authTeacher/jwtTeacherAuth',{
          headers : {
            "jwt" : cookies.jwt
          }
        })
        .then(function(response) {
           if (response.data.authenticate) {
             setAuthinticate(true);   
           }else if (!response.data.authenticate){
             setAuthinticate(false);   
             removeCookie("jwt")
             router.push("/teacher/login")
            
           }
          //console.log(response)
        }).catch(function(error) {
          removeCookie("jwt")
          router.push("/teacher/login")
          console.log(error);
          setAuthinticate(false);
        });
          }else{
           removeCookie("jwt")
            router.push("/teacher/login")
          }
        
     }, [])
     const teacherData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phoneNumber: "+123456789",
        subjects: ["Math", "Science"],
      };



  return (
    <>
    {authinticate?
  <TeacherNavLayout>
  
  {
    //<AdminUserDashboard/>
  }
    <TeacherProfile
        name={teacherData.name}
        email={teacherData.email}
        phoneNumber={teacherData.phoneNumber}
        subjects={teacherData.subjects}
    />
  </TeacherNavLayout>
  :
   <LazyLoad />
   } 
  </>
  
  );
}