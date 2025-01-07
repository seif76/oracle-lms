
'use client'

import NavLayout from "@/components/navigation/navLayout";

import YoutubeIfram from "@/components/cards/youtubeIfram";

import React, {useEffect , useState}from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie';
import LazyLoad from "@/components/loading/lazyLoading";


export default function Dashboard() {
    //https://youtu.be/Y8G6IHlftgc
    //https://youtu.be/Y8G6IHlftgc
    //https://www.youtube.com/embed/Y8G6IHlftgc?si=0kmlIz_3lH4oarE3&rel=0&modestbranding=1&autoplay=1
    //https://www.youtube.com/embed/QvlcyoLp8x0?si=0kmlIz_3lH4oarE3&rel=0&modestbranding=1&autoplay=1
    const [cookies, setCookie,removeCookie] = useCookies(['jwt']);
    const router = useRouter() ;
    const [authinticate, setAuthinticate] = useState(false);
  
    useEffect(() => {
  
  
      if (cookies.jwt) {
          axios.get('/api/auth/jwtAuth',{
          headers : {
            "jwt" : cookies.jwt
          }
        })
        .then(function(response) {
          
           if (response.data.authinticate) {
             setAuthinticate(true);   
           }else if (!response.data.authinticate){
             setAuthinticate(false);   
             removeCookie("jwt")
             router.push("/login")
            
           }
          //console.log(response)
        }).catch(function(error) {
          removeCookie("jwt")
          router.push("/login")
          console.log(error);
          setAuthinticate(false);
        });
          }else{
           removeCookie("jwt")
            router.push("/login")
          }
        
     }, [])  



  return (
    <>
    {authinticate?
    <NavLayout>
  
    <div className="flex items-center justify-center"> 
     <YoutubeIfram 
     url={"https://www.youtube.com/embed/Y8G6IHlftgc?si=0kmlIz_3lH4oarE3&rel=0&modestbranding=1&autoplay=1"}
     title={"title test "}
     category={"test category"}
     />
     
     </div>
    </NavLayout>
    :
   <LazyLoad />}
  
  </>
  );
}