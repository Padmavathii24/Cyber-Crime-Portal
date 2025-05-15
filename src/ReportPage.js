import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Assuming you have a Navbar component

const ReportPage = () => {
  const [selectedFraud, setSelectedFraud] = useState("");
  const navigate = useNavigate();

  const fraudTypes = [
    "Online Payment Fraud",
    "Job Fraud",
    "Banking Fraud",
    "Others",
  ];

  const handleNext = () => {
    if (selectedFraud) {
      const formattedFraud = selectedFraud.replace(/\s+/g, "").replace(/\//g, ""); // Removes spaces and slashes
      navigate(`/report/${formattedFraud}`);
    }
  };
  
  

  return (
    <div className="bg-gray-100">
      {/* Navbar Component */}
      <Navbar />

      {/* Report Form Section */}
      <div className="pt-24 p-6">
        <div className="bg-white shadow-lg p-6 rounded-lg max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Report Cyber Crime</h2>
          <label className="block text-lg font-medium mb-2">Select the type of fraud:</label>
          <select
            value={selectedFraud}
            onChange={(e) => setSelectedFraud(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
          >
            <option value="">-- Select Fraud Type --</option>
            {fraudTypes.map((fraud, index) => (
              <option key={index} value={fraud}>
                {fraud}
              </option>
            ))}
          </select>
          <button
            onClick={handleNext}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
