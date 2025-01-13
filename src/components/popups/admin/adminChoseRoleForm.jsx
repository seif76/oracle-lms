import React, { useState } from "react";
import StudentRegistrationForm from "@/components/Forms/adminAddStudentForm";
const ChooseRolePopup = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");

  const handleNext = () => {
    if (selectedRole) {
      setStep(2);
    } else {
      alert("Please select a role before proceeding.");
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedRole("");
  };

  const handleStudentSubmit = (studentData) => {
    alert("Student registered successfully!");
    console.log("Student Data:", studentData);
    onClose(); // Close the popup after successful registration
  };

  const handleSubmit = () => {
    alert(`Form submitted for ${selectedRole}`);
    onClose(); // Close the popup after submission
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Step 1: Select Role */}
        {step === 1 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Select a User Role</h2>
            <div className="flex justify-around mb-6">
              {["Student", "Teacher", "Admin"].map((role) => (
                <button
                  key={role}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedRole === role
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="text-center">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          // Step 2: Role Form
          <div>
            {selectedRole === "Student" ? (
              <StudentRegistrationForm onSubmit={handleStudentSubmit} />
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-center">{`Fill ${selectedRole} Details`}</h2>
                <form className="space-y-4">
                  {selectedRole === "Teacher" && (
                    <>
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Subject</label>
                        <input
                          type="text"
                          placeholder="Enter Subject"
                          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          placeholder="Enter Experience"
                          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                        />
                      </div>
                    </>
                  )}
                  {selectedRole === "Admin" && (
                    <>
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Admin Code</label>
                        <input
                          type="text"
                          placeholder="Enter Admin Code"
                          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                        />
                      </div>
                    </>
                  )}
                </form>
                <div className="flex justify-between mt-6">
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseRolePopup;
