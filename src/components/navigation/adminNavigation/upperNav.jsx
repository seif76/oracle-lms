
import React from "react"
import Link from "next/link";

import * as FiIcons from 'react-icons/fi';
import * as AiIcons from 'react-icons/ai';



import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'



export default function UpperNav() {
    const LogoutIcon = FiIcons["FiLogOut"];

    const [cookies, setCookie , removeCookie] = useCookies(['jwt']);
    const router = useRouter()

    


    function handleSignOut() {
      removeCookie("jwt")
      router.push("/login")
      
    }


    return (
     
< >

  <div className="hidden sm:ml-72 sm:mt-6 sm:mb-6 md:block">
  <div className="relative">
      
    </div>
  </div>

<div className="hidden md:flex  gap-x-2 ml-auto mr-4">
    
 
   
     <Link onClick={handleSignOut} href="/admin/login" className="flex">
    
              <div className="flex-shrink-0 mt-[3px] w-4 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
              
              <LogoutIcon size={20} />
              </div>
               
              
            
               <span className="flex-1 ml-3 text-2xl sm:text-base whitespace-nowrap">Sign Out</span>
     </Link>
    
    
  
</div>
</>
    )
}
