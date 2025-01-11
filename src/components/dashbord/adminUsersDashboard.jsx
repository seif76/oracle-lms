"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminEditUser from "../popups/admin/adminEditUsers";

const AdminUserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filter, setFilter] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "student",
    password:"",
    parentContact:"",
  });
  /*const users = [
    {
      _id: "1",
      name: "Lindsay Walton",
      email: "lindsay.walton@example.com",
      phoneNumber: "123-456-7890",
      role: "Front-end Developer",
    },
    {
      _id: "2",
      name: "Courtney Henry",
      email: "courtney.henry@example.com",
      phoneNumber: "234-567-8901",
      role: "Designer",
    },
    {
      _id: "3",
      name: "Tom Cook",
      email: "tom.cook@example.com",
      phoneNumber: "345-678-9012",
      role: "Director of Product",
    },
    {
      _id: "4",
      name: "Whitney Francis",
      email: "whitney.francis@example.com",
      phoneNumber: "456-789-0123",
      role: "Copywriter",
    },
    {
      _id: "5",
      name: "Leonard Krasner",
      email: "leonard.krasner@example.com",
      phoneNumber: "567-890-1234",
      role: "Senior Designer",
    },
    {
      _id: "6",
      name: "Floyd Miles",
      email: "floyd.miles@example.com",
      phoneNumber: "678-901-2345",
      role: "Principal Designer",
    },
  ];*/

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

  /*const updateUser = async (id) => {
    try {
      await axios.put(`/api/users/updateById/${id}`, formData);
      fetchUsers(); // Refresh data after update
    } catch (error) {
      console.error("Error updating user", error);
    }
  };*/

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

      {/* Filters */}
      {/*<div className="mb-4 flex gap-4">
        <select
          className="border p-2"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Filter by email"
          className="border p-2"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />
        <button onClick={fetchUsers} className="bg-blue-500 text-white p-2">
          Apply Filters
        </button>
      </div>*/}
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
        <h2 className="text-xl font-bold mb-2">Add New User</h2>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 mr-2"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          className="border p-2 mr-2"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          className="border p-2 mr-2"
          value={newUser.phoneNumber}
          onChange={(e) =>
            setNewUser({ ...newUser, phoneNumber: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Parent Phone"
          className="border p-2 mr-2"
          value={newUser.parentContact}
          onChange={(e) =>
            setNewUser({ ...newUser, parentContact: e.target.value })
          }
        />
        <input
            type="password"
            placeholder="Password"
            className="border p-2 mr-2"
            value={newUser.password}
            onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
            }
          />
        <select
          className="border p-2 mr-2"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={createUser} className="bg-green-500 text-white p-2">
          Add User
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
