import React, { useState } from "react";
import axios from "axios";

const EnrollmentByPhone = ({ closePopup }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEnrollment = async () => {
    setError(null);
    setLoading(true);
    setEnrollmentData(null);

    try {
      const response = await axios.get(
        `/api/enrollment-by-phone/${phoneNumber}`
      );
      setEnrollmentData(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "An error occurred");
      } else {
        setError("Unable to fetch enrollment data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.trim() === "") {
      setError("Phone number cannot be empty");
      return;
    }
    fetchEnrollment();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-5">Search Enrollment by Phone Number</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="p-3 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="text-blue-700 hover:text-white p-2 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-center text-gray-500 mt-5">Loading...</p>}

        {error && <p className="text-center text-red-500 mt-5">{error}</p>}

        {enrollmentData && (
          <div className="mt-10 p-5 border rounded-xl">
            <h2 className="text-xl font-bold mb-3">Student Details</h2>
            <p>
              <strong>Name:</strong> {enrollmentData.student.name}
            </p>
            <p>
              <strong>Phone:</strong> {enrollmentData.student.phoneNumber}
            </p>

            {/* Display Enrolled Courses */}
            <h3 className="text-lg font-bold mt-5">Enrolled Courses</h3>
            <ul className="list-disc ml-5">
              {enrollmentData.courses.map((course) => (
                <li key={course.id}>
                  <strong>{course.title}</strong>: {course.description}
                </li>
              ))}
            </ul>

            {/* Display Videos Watched */}
            <h3 className="text-lg font-bold mt-5">Videos Watched</h3>
            <ul className="list-disc ml-5">
              {enrollmentData.videosWatched.map((video) => (
                <li key={video.id}>
                  <strong>{video.title}</strong>: {video.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Close Button (Go Back) */}
        <button
          onClick={closePopup} // Close the popup by calling the closePopup function
          className="mt-5 text-blue-700 hover:text-white p-2 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default EnrollmentByPhone;
