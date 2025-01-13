"use client"
import React,{useState,useEffect} from 'react'

import NavLayout from "@/components/navigation/navLayout";
import StudentProfile from '@/components/profiles/studentProfile';

import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ProfilePage = () => {
    const [cookies, setCookie,removeCookie] = useCookies(['jwt']);
    const [studentData, setStudentData] = useState([]);
    const router = useRouter();
    const token = cookies.jwt;

   
    
    useEffect(() => {
         if(token){
            const decodedJwt = jwtDecode(token);
            const id = decodedJwt.id;


            axios.get(`/api/students/getById/${id}`)
              .then(function(response) {
                
                 if (response.data) {
                    setStudentData(response.data);   
                   }
                //console.log(response)
              }).catch(function(error) {
                console.log(error)
                
              });

             }else{
                 removeCookie("jwt")
                 router.push("/login")
                }
            
         
       }, [])
  
    

  return (
    <>
   <NavLayout>
     <StudentProfile 
       name ={studentData?.name}
       email ={studentData?.email}
       phoneNumber = {studentData?.phoneNumber}
       parentContact = {studentData?.parentContact}
      />
   </NavLayout>
  </>
  )
}

export default ProfilePage