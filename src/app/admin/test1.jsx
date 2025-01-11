"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(""); // For filtering by roles or email
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "student", // Default role
  });

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
      await axios.post("/api/users", formData);
      fetchUsers(); // Refresh data after creation
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const updateUser = async (id) => {
    try {
      await axios.put(`/api/users/updateById/${id}`, formData);
      fetchUsers(); // Refresh data after update
    } catch (error) {
      console.error("Error updating user", error);
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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter by role or email"
        className="border p-2 mb-4 w-full"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* User Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Phone Number</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">{user.phoneNumber}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 mr-2"
                  onClick={() => updateUser(user._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create User Form */}
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2">Add User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createUser();
          }}
        >
          <input
            type="text"
            placeholder="Name"
            className="border p-2 mb-2 w-full"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 mb-2 w-full"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 mb-2 w-full"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="border p-2 mb-2 w-full"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
          <select
            className="border p-2 mb-2 w-full"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            onClick={createUser}
            className="bg-green-500 text-white px-4 py-2"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUsersPage;
