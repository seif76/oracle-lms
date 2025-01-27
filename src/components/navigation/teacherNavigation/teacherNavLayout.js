'use client'
import React , {useState , useEffect} from "react"
import TeacherNavbar from "./teacherNav";
import UpperTeacherNav from "./upperTeacherNav";

export default function TeacherNavLayout({ children }) {
  
    return(
        <>
        <div className="border-b h-full flex items-center bg-white shadow-sm">
        <TeacherNavbar />
        <UpperTeacherNav/>
        
        </div>
        
        <div className="p-4  sm:mt-8 mt-[6.25rem] sm:ml-64">
         {
         //children
         }
         {
         React.cloneElement(children)
        }
        </div>
        
        </>
    ) 
    
  }