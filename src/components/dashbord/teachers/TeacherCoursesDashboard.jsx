import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import TeacherCourseCreation from "@/components/Forms/teachers/teacherCourseCreation";
import TeacherEditCourse from "@/components/popups/teacher/teacherEditCourse";

import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

const TeacherCoursesDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const [cookies, setCookie,removeCookie] = useCookies(['jwt']);
  const token = cookies.jwt;

  const fetchCourses = async () => {
    try {
        const decodedJwt = jwtDecode(token);
        const teacherId = decodedJwt.id;
      setLoading(true); // Set loading to true while fetching data
      const response = await axios.get(`/api/courses/getCourses/${teacherId}`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleCourseCreated = (newCourse) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`/api/courses/deleteById/${courseId}`);
      fetchCourses(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting course", error);
    }
  };

  const handleEditClick = (CourseData) => {
    setSelectedId(CourseData._id);
    setSelectedCourse(CourseData);
    setEditModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(filter.toLowerCase()) ||
      course.description?.toLowerCase().includes(filter.toLowerCase()) ||
      course.teacherName?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>

      {/* Filter and Add Course Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Filter by title, description, or teacher name"
          className="border p-2 w-[48%]"
          value={filter}
          onChange={handleFilterChange}
        />
        <button
          onClick={() => setAddModalOpen(true)}
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Add Course
        </button>
      </div>

      {/* Courses Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Teacher</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? ( // Show loading indicator while data is being fetched
            <tr>
              <td colSpan="5" className="text-center p-4">
                Loading courses...
              </td>
            </tr>
          ) : (
            filteredCourses.map((course) => (
              <tr key={course._id}>
                <td className="border p-2">{course.title}</td>
                <td className="border p-2">{course.description || "N/A"}</td>
                <td className="border p-2">{course.teacherName || "Unknown Teacher"}</td>
                <td className="border p-2">{new Date(course.createdAt).toLocaleDateString()}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick({ ...course })}
                    className="text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Add Course */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <button
          onClick={() => setAddModalOpen(false)}
          className="text-gray-500  hover:text-gray-800"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          
        </button>
        </div>
            <TeacherCourseCreation
              onClose={() => setAddModalOpen(false)}
              onCourseCreated={handleCourseCreated}
            />
          </div>
        </div>
      )}

      {/* Modal for Edit Course */}
      <TeacherEditCourse
        show={isEditModalOpen}
        handleClose={() => setEditModalOpen(false)}
        courseData={selectedCourse}
        id={selectedId}
        fetchCourses={fetchCourses}
      />
    </div>
  );
};

export default TeacherCoursesDashboard;
