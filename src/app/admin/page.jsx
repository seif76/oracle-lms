'use client'
import React, {useEffect , useState}from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie';

import NavLayout from "@/components/navigation/adminNavigation/adminNavLayout";
import LazyLoad from "@/components/loading/lazyLoading";
import AdminUserDashboard from "@/components/dashbord/adminUsersDashboard";
export default function Dashboard() {
  
    const [cookies, setCookie,removeCookie] = useCookies(['jwt']);
    const router = useRouter() ;
    //const [authinticate, setAuthinticate] = useState(false);
    const [authinticate, setAuthinticate] = useState(true);
  
  
    /*useEffect(() => {
  
  
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
        
     }, [])*/



  return (
    <>
    {authinticate?
  <NavLayout>
  
  <AdminUserDashboard/>
  </NavLayout>
  :
   <LazyLoad />
   } 
  </>
  
  );
}