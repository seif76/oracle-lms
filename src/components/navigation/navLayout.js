
'use client'
import React , {useState , useEffect} from "react"
import Link from "next/link";

import Navbar from "./navbar"
import NavbarSearch from "./navSearch"
import { useRouter,usePathname } from 'next/navigation'


//import { useRouter } from 'next/navigation'

export default function navLayout({ children }) {
  
  const [searchquery, setSearchQuery] = useState("");
  useEffect(() => {
    
    setSearchQuery(searchquery); 
    
  }, [searchquery]);

  
    return(
        <>
        <div className="border-b h-full flex items-center bg-white shadow-sm">
        <Navbar />
        <NavbarSearch 
        searchquery={searchquery} 
        setSearchQuery={setSearchQuery}
        />
        
        </div>
        
        <div className="p-4  sm:mt-8 mt-[6.25rem] sm:ml-64">
         {
         //children
         }
         {React.cloneElement(children, { searchquery })}
        </div>
        
        </>
    ) 
    
  }