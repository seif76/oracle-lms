import React, { useState } from "react";
import axios from "axios";
import { useEffect } from 'react';

const StudentRegistrationForm = ({ onSubmit }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    parentContact: "",
  });


  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", {
        ...studentData,
        role: "student"
      });
      setSuccessMessage("Student registered successfully!");
      setStudentData({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        parentContact: "",
      });
      onSubmit(studentData); 
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };





  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-600 font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={studentData.name}
          onChange={handleChange}
          placeholder="Enter Name"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={studentData.email}
          onChange={handleChange}
          placeholder="Enter Email"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={studentData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={studentData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter Phone Number"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">Parent's Contact</label>
        <input
          type="text"
          name="parentContact"
          value={studentData.parentContact}
          onChange={handleChange}
          placeholder="Enter Parent's Contact"
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <button
        type="submit"
        className={`w-full px-4 py-2 rounded-lg ${
          loading ? "bg-gray-400 cursor-not-allowed" : "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        }`}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default StudentRegistrationForm;
