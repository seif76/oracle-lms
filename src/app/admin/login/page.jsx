'use client'

import axios from "axios";
import React , {useState} from "react"

import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authinticate, setAuthinticate] = useState(false);

    const [cookies, setCookie] = useCookies(['jwt']);
    const router = useRouter()


    function handleEmail (event) {
        const currentemail  = event.target.value; 
        setEmail(currentemail);
    }

    function handlePassword (event) {
        const currentPassword = event.target.value; 
        setPassword(currentPassword);
    }

     function handleLogin(event) {
      event.preventDefault();

      axios.post('/api/auth/auth/admin/login', { email, password })
    .then((response) => {
      const token = response.data.token;
      console.log("Login Successful:", response.data.message);
      // Store token in a cookie 
      setCookie("jwt", token);  
      router.push("/"); // Navigate to dashboard or home page
    })
    .catch((error) => {
      console.error("Login Error:", error);
      // Handle error UI updates if necessary
    });
    }

    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className=" bg-loginBackround pt-16 pb-12 h-screen sm:mt-0 flex min-h-full flex-1 flex-col justify-center px-6 sm:py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-24 w-auto"
              src="/images/logo/oracle-logo.jpeg"
              alt="oracle image"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleEmail}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                  onChange={handlePassword}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  onClick={handleLogin}
                  
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
  
           
          </div>
        </div>
      </>
    )
  }
  