import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styleForms.css";

const jobFraudOptions = {
  "Online Job Fraud": [
    "Your Full Name",
    "Company Name",
    "Job Position",
    "How did you find this job?",
    "What was the promised salary?",
    "Did you pay any registration/processing fee?",
    "How much did you pay?",
    "Payment method used",
    "Recruiter's contact details",
    "Upload any job offer letters or communication",
    "Have you contacted the real company?",
    "Did you report to job portal?",
    "Any additional details"
  ],
  "Cheating by Impersonation (Pretending to be another person)": [
    "Your Full Name",
    "Impersonator's Details",
    "Which company did they claim to represent?",
    "How did they contact you?",
    "What documents did they ask for?",
    "Did you share any documents?",
    "Did you pay any money?",
    "How much did you pay?",
    "Payment method used",
    "Upload any communication or documents",
    "Have you reported to the company?",
    "Any additional details"
  ],
  "Fake Profile": [
    "Where did you find the fake profile? (LinkedIn, Instagram, etc.)",
    "What name was used in the fake profile?",
    "Was it pretending to be you or someone you know?",
    "Did they contact you or others using the fake profile?",
    "Upload screenshot of the fake profile (if any)",
    "Did the profile ask for money or sensitive info?",
    "Did you report the profile on the platform?",
    "What was the platform's response?",
    "Do you have any communication with the fake profile?",
    "Upload chat or messages (if any)",
    "Do you know who might have created it?",
    "How did this impact you emotionally or socially?",
    "Any additional details you'd like to share?"
  ]
};

function JobFraud() {
  const navigate = useNavigate();
  const [selectedFraudType, setSelectedFraudType] = useState("");
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e, question) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Content = event.target.result.split(',')[1]; // Remove data URL prefix
          setFormData(prev => ({
            ...prev,
            [question]: {
              file: file,
              base64: base64Content
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [question]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Please login first');
        navigate('/');
        return;
      }

      // Format the form data into a structured object
      const formattedDetails = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value === 'object' && value.file) {
          // Skip file objects in details
          return;
        }
        formattedDetails[key] = value;
      });

      // Process file attachments
      const attachments = [];
      Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value === 'object' && value.file) {
          attachments.push({
            filename: value.file.name,
            type: value.file.type,
            size: value.file.size,
            content: value.base64
          });
        }
      });

      const reportData = {
        citizenEmail: userEmail,
        fraudType: 'Job Fraud',
        subType: selectedFraudType,
        details: formattedDetails,
        status: 'pending',
        attachments: attachments,
        priority: 'normal',
        notes: ''
      };

      const response = await fetch('http://localhost:5000/api/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Report submitted successfully! Your tracking ID is ${result.trackingId}`);
        navigate('/track', { state: { trackingId: result.trackingId } });
      } else {
        alert('Failed to submit report: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputField = (question) => {
    const lower = question.toLowerCase();
    if (lower.includes("upload")) {
      return (
        <input
          type="file"
          className="form-input"
          onChange={(e) => handleChange(e, question)}
        />
      );
    } else {
      return (
        <input
          type="text"
          className="form-input"
          value={formData[question] || ""}
          onChange={(e) => handleChange(e, question)}
        />
      );
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">Job Fraud Reporting Form</h2>

      <label className="form-label">Select Fraud Type:</label>
      <select
        className="form-input"
        value={selectedFraudType}
        onChange={(e) => {
          setSelectedFraudType(e.target.value);
          setFormData({});
        }}
      >
        <option value="">-- Select --</option>
        {Object.keys(jobFraudOptions).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {selectedFraudType && (
        <form onSubmit={handleSubmit}>
          {jobFraudOptions[selectedFraudType].map((question, index) => (
            <div key={index} className="form-group">
              <label className="form-label">{question}</label>
              {getInputField(question)}
            </div>
          ))}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      )}
    </div>
  );
}

export default JobFraud;
