"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminEditUser from "../popups/admin/adminEditUsers";
import ChooseRolePopup from "../popups/admin/adminChoseRoleForm";

const AdminUserDashboard = () => {
  const [users, setUsers] = useState([]);
  //const [filterRole, setFilterRole] = useState("");
  const [filter, setFilter] = useState("");
  //const [filterEmail, setFilterEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "student",
    password:"",
    parentContact:"",
  });
  
  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      alert(response.data) // Adjust API route as necessary
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const createUser = async () => {
    try {
      await axios.post("/api/users", newUser);
      fetchUsers(); // Refresh data after creation
    } catch (error) {
      console.error("Error creating user", error);
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
      user.role.includes(filter) || user.email.includes(filter)
  );

  const handleEditClick = (userData) => {
    setSelectedId(userData._id);
    setSelectedUser(userData);
    setEditModalOpen(true);
  };
 
  const handleModalClose = () => {
    setEditModalOpen(false);
    setEditUserId(null);
  };

  const handleUpdate = () => {
    // Logic to refresh user data or UI after updating
    console.log("User updated successfully!");
  };



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <input
        type="text"
        placeholder="Filter by role or email"
        className="border p-2 mb-4 w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* User Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.phoneNumber}</td>
              <td className="border p-2">{user.role}</td>
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

      {/* Add User */}
      <div className="mt-4">
        <button onClick={() => setIsRegisterPopupOpen(true)} className="bg-green-500 text-white p-2">
          Add User
        </button>
        {isRegisterPopupOpen && 
        <ChooseRolePopup 
        onClose={() => setIsRegisterPopupOpen(false)} />}
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
