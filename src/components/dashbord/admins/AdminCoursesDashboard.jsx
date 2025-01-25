import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import CourseCreationForm from "../../Forms/CourseCreationForm";
import AdminEditCourse from "@/components/popups/admin/adminEditCourse";

const AdminCoursesDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const fetchCourses = async () => {
    try {
      setLoading(true); // Set loading to true while fetching data
      const response = await axios.get("/api/courses/get-courseand-teachername");
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
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <CourseCreationForm
              onClose={() => setAddModalOpen(false)}
              onCourseCreated={handleCourseCreated}
            />
          </div>
        </div>
      )}

      {/* Modal for Edit Course */}
      <AdminEditCourse
        show={isEditModalOpen}
        handleClose={() => setEditModalOpen(false)}
        courseData={selectedCourse}
        id={selectedId}
        fetchCourses={fetchCourses}
      />
    </div>
  );
};

export default AdminCoursesDashboard;

























// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import CourseCreationForm from "../../Forms/CourseCreationForm";
// import AdminEditCourse from "@/components/popups/admin/adminEditCourse";

// const AdminCoursesDashboard = () => {
//   const [courses, setCourses] = useState([]);
//   const [filter, setFilter] = useState("");
//   const [isAddModalOpen, setAddModalOpen] = useState(false); // Manage Add modal visibility
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [selectedId, setSelectedId] = useState("");
//   const [isEditModalOpen, setEditModalOpen] = useState(false);

//   const fetchCourses = async () => {
//     try {
//       // get courses with Populate method to get teahers name 
//       const response = await axios.get("/api/courses/get-courseand-teachername");
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Error fetching courses", error);
//     }
//   };

//   const handleCourseCreated = (newCourse) => {
//     // Add new course to the courses list
//     setCourses((prevCourses) => [...prevCourses, newCourse]);
//   };
//   const deleteCourse = async (courseId) => {
//     // Add new course to the courses list
//       try {
//         await axios.delete(`/api/courses/deleteById/${courseId}`);
//         fetchCourses(); // Refresh data after deletion
//       } catch (error) {
//         console.error("Error deleting user", error);
//       }
//   };

//   const handleEditClick = (CourseData) => {
//     setSelectedId(CourseData._id);
//     setSelectedCourse(CourseData);
//     setEditModalOpen(true);
//   };


//   const handleFilterChange = (e) => {
//     setFilter(e.target.value);
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const filteredCourses = courses.filter(
//     (course) =>
//       course.title.toLowerCase().includes(filter.toLowerCase()) ||
//       course.description?.toLowerCase().includes(filter.toLowerCase()) ||
//       course.teacherName?.toLowerCase().includes(filter.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Course Management</h1>

//       {/* Filter and Add Course Button */}
//       <div className="flex justify-between items-center mb-4">
//         <input
//           type="text"
//           placeholder="Filter by title, description, or teacher name"
//           className="border p-2 w-[48%]"
//           value={filter}
//           onChange={handleFilterChange}
//         />
//         <button
//           onClick={() => setAddModalOpen(true)} // Show the Add Course Modal
//           className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
//         >
//           Add Course
//         </button>
//       </div>

//       {/* Courses Table */}
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border p-2">Title</th>
//             <th className="border p-2">Description</th>
//             <th className="border p-2">Teacher</th>
//             <th className="border p-2">Created At</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredCourses.map((course) => (
//             <tr key={course._id}>
//               <td className="border p-2">{course.title}</td>
//               <td className="border p-2">{course.description || "N/A"}</td>
//               <td className="border p-2">{course.teacherName || "Unknown Teacher"}</td>
//               <td className="border p-2">{new Date(course.createdAt).toLocaleDateString()}</td>
//               <td className="border p-2 flex gap-2">
//                 <button
//                   onClick={() => handleEditClick({ ...course })} // Edit course
//                   className="text-blue-500"
//                 >
//                   <FaEdit />
//                 </button>
//                 <button
//                   onClick={() => deleteCourse(course._id)} // Delete course
//                   className="text-red-500"
//                 >
//                   <FaTrash />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal for Add Course */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
//             <h2 className="text-xl font-bold mb-4">Add New Course</h2>
//             <CourseCreationForm
//               onClose={() => setAddModalOpen(false)} // Close the modal
//               onCourseCreated={handleCourseCreated} // Pass the function to add course
//             />
           
//           </div>
//         </div>
//       )}

//     <AdminEditCourse
//         show={isEditModalOpen}
//         handleClose={() => setEditModalOpen(false)}
//         courseData={selectedCourse}
//         id={selectedId}
//         fetchCourses={fetchCourses}
//       />

//     </div>
//   );
// };

// export default AdminCoursesDashboard;
