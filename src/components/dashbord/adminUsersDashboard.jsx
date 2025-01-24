"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import AdminEditUser from "../popups/admin/adminEditUsers";
import ChooseRolePopup from "../popups/admin/adminChoseRoleForm";

const AdminUserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);  // Current page for pagination
  const usersPerPage = 10;  // Number of users per page

  const columns = ["name", "email", "phoneNumber", "role", "subjects", "parentContact"];

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/deleteById/${id}`);
      fetchUsers(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component load
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.role.includes(filter) ||
      user.email.includes(filter) ||
      user.name.includes(filter)
  );

  // Calculate the users to display based on currentPage
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleEditClick = (userData) => {
    setSelectedId(userData._id);
    setSelectedUser(userData);
    setEditModalOpen(true);
  };

  const nextPage = () => {
    if (currentPage * usersPerPage < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(Math.ceil(filteredUsers.length / usersPerPage));
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage); // Calculate total pages

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Filter by name, role, or email"
          className="border p-2 mb-4 w-[48%]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          onClick={() => setIsRegisterPopupOpen(true)}
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        >
          Add User
        </button>
      </div>

      {isRegisterPopupOpen && (
        <ChooseRolePopup onClose={() => setIsRegisterPopupOpen(false)} />
      )}

      {/* User Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="border p-2">
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </th>
            ))}
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id}>
              {columns.map((column) => (
                <td key={column} className="border p-2">
                  {/* Check if the column is 'parentContact' */}
                  {column === 'parentContact'
                    ? user.role === 'student'
                      ? user[column] !== null && user[column] !== undefined
                        ? user[column]
                        : 'null' // Display 'null' if no parentContact for student
                      : 'null' // Display 'null' for non-student roles (teacher, admin)
                    : Array.isArray(user[column]) // Check if the field is an array
                    ? user[column].length > 0
                      ? user[column].join(', ') // Join array elements into a string
                      : 'null'
                    : user[column] !== null && user[column] !== undefined
                    ? user[column]
                    : 'null'}
                </td>
              ))}
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEditClick({ ...user })}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center mt-4 space-x-2">
        {/* Jump to First Page Button */}
        <button
          onClick={goToFirstPage}
          className="text-blue-700 hover:text-white p-2 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm"
        >
          <MdKeyboardDoubleArrowLeft />
        </button>

        {/* Previous Page Button */}
        <button
          onClick={prevPage}
          className="text-blue-700 hover:text-white p-2 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm"
          disabled={currentPage === 1}
        >
          <MdKeyboardArrowLeft />
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => goToPage(index + 1)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === index + 1
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Next Page Button */}
        <button
          onClick={nextPage}
          className="text-blue-700 hover:text-white p-2 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm"
          disabled={currentPage * usersPerPage >= filteredUsers.length}
        >
          <MdKeyboardArrowRight />
        </button>

        {/* Jump to Last Page Button */}
        <button
          onClick={goToLastPage}
          className="text-blue-700 hover:text-white p-2 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm"
        >
          <MdKeyboardDoubleArrowRight />
        </button>
      </div>

      <AdminEditUser
        show={isEditModalOpen}
        handleClose={() => setEditModalOpen(false)}
        userData={selectedUser}
        id={selectedId}
        fetchUsers={fetchUsers}
      />
    </div>
  );
};

export default AdminUserDashboard;
