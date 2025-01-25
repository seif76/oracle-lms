'use client'

import React, {useEffect , useState}from "react";
import axios from "axios";

import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

export default function AccessCodesPopup({videoId, isOpen ,setIsModalOpen}) {
  const [accessCode, setAccessCode] = useState("");
  const [cookies, setCookie,removeCookie] = useCookies(['jwt']);
  const token = cookies.jwt;
  const decodedJwt = jwtDecode(token);
  const StudentId = decodedJwt.id;
  const router = useRouter();

  const [errorMassage, setErrorMassage] = useState("");

  if (!isOpen) return null; // Don't render the modal if it's not open

  const onClose = () =>{
    setErrorMassage("")
    setAccessCode("")
    setIsModalOpen(false)
  }
  const onSubmit = (accessCode) => {
    axios.post(`/api/AccessCode/validate`,{
        videoId: videoId,
        code: accessCode ,
        studentId: StudentId
    }) .then(function(response) {
                
         if (response.data.isValid) {
            router.push(`/video/${videoId}`)   
            }
            }).catch(function(error) {
                setErrorMassage("Access Code Denied")
                console.log(error)
            });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Enter Access Code</h2>
        <input
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="Enter your access code"
          className="w-full p-2 border rounded-lg mb-4"
        />
        {errorMassage? <h2 className="text-sm text-red-600 font-bold mt-2">{errorMassage}</h2>
        :<></>
        }
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(accessCode)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
