'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

import NavLayout from "@/components/navigation/adminNavigation/adminNavLayout";
import LazyLoad from "@/components/loading/lazyLoading";
import AdminCoursesDashboard from "@/components/dashbord/admins/AdminCoursesDashboard";
import AnalyticsDashboard from "@/components/dashbord/admins/AdminAnalytics";
//import AdminAnalytics from "@/components/dashbord/admins/AdminAnalytics";
//import AnalyticsDashboard, { AdminAnalytics } from "@/components/dashbord/admins/AdminAnalytics";

export default function Dashboard() {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const router = useRouter();
  const [authinticate, setAuthinticate] = useState(true);

  useEffect(() => {
    if (cookies.jwt) {
      axios.get('/api/auth/jwtAuth', {
        headers: {
          jwt: cookies.jwt
        }
      })
      .then(response => {
        if (response.data.authinticate) {
          setAuthinticate(true);
        } else {
          setAuthinticate(false);
          removeCookie("jwt");
          router.push("/admin/login");
        }
      })
      .catch(() => {
        removeCookie("jwt");
        router.push("/admin/login");
        setAuthinticate(false);
      });
    } else {
      removeCookie("jwt");
      router.push("/admin/login");
    }
  }, []);

  return (
    <>
      {authinticate ? (
        <NavLayout>
          <AdminCoursesDashboard />
        </NavLayout>
      ) : (
        <LazyLoad />
      )}
    </>
  );
}
