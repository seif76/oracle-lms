"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminEditUser = ({ show, handleClose, userData, id ,fetchUsers }) => {
  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "student", // Default to "student"
    password: "",
  });

  // Sync formData with userData when userData changes
  useEffect(() => {
    if (userData) {
        alert(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        role: userData.role || "student",
        password: userData.password || "",
      });
    }
  }, [userData]); // Re-run whenever userData changes

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`/api/users/updateById/${id}`, formData);
        fetchUsers(); // Fetch updated users list
        handleClose(); // Close the modal
      } catch (error) {
        console.error("Error updating user", error);
      }
    
    //updateUser(formData); // Pass updated data back to the parent
    //handleClose(); // Close the modal
  };
  const updateUser = async (formData) => {
 
      try {
        await axios.put(`/api/users/updateById/${id}`, formData);
       // fetchUsers(); // Refresh data after update
      } catch (error) {
        console.error("Error updating user", error);
      }
    };

  if (!show) return null; // Don't render if not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditUser;
