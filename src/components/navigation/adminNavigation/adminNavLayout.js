
'use client'
import React , {useState , useEffect} from "react"
import Link from "next/link";

import Navbar from "./adminNav"
import { useRouter,usePathname } from 'next/navigation'
import UpperNav from "./upperNav";


//import { useRouter } from 'next/navigation'

export default function navLayout({ children }) {
  
  

  
    return(
        <>
        <div className="border-b h-full flex items-center bg-white shadow-sm">
        <Navbar />
        <UpperNav/>
        
        </div>
        
        <div className="p-4  sm:mt-8 mt-[6.25rem] sm:ml-64">
         {
         //children
         }
         {React.cloneElement(children)}
        </div>
        
        </>
    ) 
    
  }