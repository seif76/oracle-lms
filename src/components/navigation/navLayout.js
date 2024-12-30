
import React , {useState , useEffect} from "react"
import Link from "next/link";

import Navbar from "./navbar"
//import NavbarSearch from "./navbarSearch"


//import { useRouter } from 'next/navigation'

export default function navLayout({ children }) {
  
  const [SearchWord, setSearchWord] = useState("");
  


  
    return(
        <>
        <div className="border-b h-full flex items-center bg-white shadow-sm">
        <Navbar />{
        //<NavbarSearch 
        //handleSearchWord={handleSearchWord}
        ///>
        }
      </div>
     {
      //<Link href={`/?words=${SearchWord}`}></Link>
     }
        
        <div className="p-4  sm:mt-8 mt-[6.25rem] sm:ml-64">
         {children}
        </div>
        
        </>
    ) 
    
  }