
import React from "react"
import Link from "next/link";

import * as FiIcons from 'react-icons/fi';
import * as AiIcons from 'react-icons/ai';



import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'



export default function NavbarSearch(
  {
     searchquery, 
     setSearchQuery 
  }
) {
    const LogoutIcon = FiIcons["FiLogOut"];
    const SearchIcon = AiIcons["AiOutlineSearch"];

    const [cookies, setCookie , removeCookie] = useCookies(['jwt']);
    const router = useRouter()

    const handleSearchChange = (word) => {
        setSearchQuery(word); // Update the state in parent
        //alert("Search query updated:"+ word);
      };
   


    function handleSignOut() {
      removeCookie("jwt")
      router.push("/login")
      
    }


    return (
     
< >

  <div className="hidden sm:ml-72 sm:mt-6 sm:mb-6 md:block">
  <div className="relative">
      <SearchIcon
        className="h-4 w-4 absolute top-3 left-3 text-slate-600"
      />
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[300px] pl-9 bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a lesson"
        //onChange={event =>{setSearchQuery(event.target.value)}}
        value={searchquery}
        onChange={event =>{handleSearchChange(event.target.value)}}
      />
    </div>
  </div>

<div className="hidden md:flex  gap-x-2 ml-auto mr-4">
    
 
   
     <Link onClick={handleSignOut} href="#" className="flex">
    
              <div className="flex-shrink-0 mt-[3px] w-4 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
              
              <LogoutIcon size={20} />
              </div>
               
              
            
               <span className="flex-1 ml-3 text-2xl sm:text-base whitespace-nowrap">Sign Out</span>
     </Link>
    
    
  
</div>
</>
    )
}
