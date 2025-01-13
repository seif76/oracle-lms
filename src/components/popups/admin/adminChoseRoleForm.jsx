import React, { useState } from "react";
import StudentRegistrationForm from "@/components/Forms/adminAddStudentForm";
import TeacherRegistrationForm from "@/components/Forms/adminAddTeacherForm";
import AdminRegistrationForm from "@/components/Forms/adminAddAdminForm";
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

  const handleTeacherSubmit = (TeacherData) => {
    alert("Teacher registered successfully!");
    console.log("Teacher Data:", TeacherData);
    onClose(); // Close the popup after successful registration
  };

  const handleAdminSubmit = (AdminData) => {
    alert("Admin registered successfully!");
    console.log("Admin Data:", AdminData);
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
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
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
                
                  {selectedRole === "Teacher" && (
                    <>
                     <TeacherRegistrationForm onSubmit={handleTeacherSubmit}/> 
                    </>
                  )}
                  {selectedRole === "Admin" && (
                    <>
                      <AdminRegistrationForm onSubmit={handleAdminSubmit}/>
                    </>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseRolePopup;
