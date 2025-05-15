// OnlinePaymentFraud.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styleForms.css";

const questions = {
  "UPI Fraud": [
    "Your Full Name",
    "Phone Number Used for UPI",
    "UPI App Name (Google Pay, PhonePe, etc.)",
    "Transaction ID (if any)",
    "Date and Time of Fraud",
    "Amount Involved",
    "Fraudster's UPI ID or Phone Number",
    "Brief Description of the Incident",
    "Did you click any suspicious link?",
    "Have you already filed a police complaint?",
    "Upload Screenshot of the Transaction or Chat (if any)", // Evidence
  ],
  "Debit/Credit/Sim Swap Fraud": [
    "Your Full Name",
    "Bank Name",
    "Card Type (Debit/Credit)",
    "Last 4 digits of Card Number",
    "Date and Time of Fraud",
    "Amount Deducted",
    "Brief Description of How Fraud Happened",
    "Did you share OTP with anyone?",
    "Have you contacted your bank?",
    "Upload Bank Statement or Screenshot of Fraud", // Evidence
  ],
  "Internet Banking Related Fraud": [
    "Your Full Name",
    "Bank Name",
    "Type of Account (Savings/Current)",
    "Did you receive any suspicious email or link?",
    "Date and Time of Fraud",
    "Amount Lost",
    "Describe what happened",
    "Have you changed your internet banking password?",
    "Did you get any SMS alerts?",
    "Upload Screenshot or Email Received (if any)", // Evidence
  ],
  "E-Wallet Related Fraud": [
    "Your Full Name",
    "E-Wallet Used (Paytm, PhonePe, etc.)",
    "Registered Phone Number",
    "Date and Time of Fraud",
    "Amount Lost",
    "Fraudster's Phone Number or ID",
    "Did you install any unknown app recently?",
    "Have you reported it to the wallet company?",
    "Upload Screenshot or Transaction Proof", // Evidence
  ],
  "Online Gambling": [
    "Your Full Name",
    "Platform Name",
    "Link to Website or App",
    "Date and Time of Incident",
    "Amount Invested",
    "How were you lured into gambling?",
    "Were you asked to deposit more money to withdraw?",
    "Have you contacted platform support?",
    "Upload Proof of Transaction or Communication", // Evidence
  ],
  "Cryptocurrency Fraud": [
    "Your Full Name",
    "Platform/Exchange Name",
    "Type of Crypto Involved (e.g., BTC, ETH)",
    "Wallet Address (if known)",
    "Date and Time of Incident",
    "Amount in Crypto or INR",
    "Did someone ask you to transfer crypto?",
    "Describe how the fraud happened",
    "Upload Screenshot or Wallet Info", // Evidence
  ],
  "Email Phishing": [
    "Your Full Name",
    "Email ID Targeted",
    "Suspicious Email Address",
    "Date and Time of Email Received",
    "Did the email contain any link or attachment?",
    "Did you click the link or download anything?",
    "Did you enter any personal info?",
    "Upload Screenshot of the Email", // Evidence
  ],
};

const OnlinePaymentFraud = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
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
      setFormData({ ...formData, [question]: e.target.value });
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
        fraudType: 'Online Payment Fraud',
        subType: selectedType,
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

  return (
    <div className="form-container">
      <h2 className="form-title">Online Payment Fraud Reporting</h2>

      <label className="form-label">Select the Fraud Type:</label>
      <select
        value={selectedType}
        onChange={(e) => {
          setSelectedType(e.target.value);
          setFormData({});
        }}
        className="form-select"
      >
        <option value="">-- Select --</option>
        {Object.keys(questions).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {selectedType && (
        <form onSubmit={handleSubmit} className="form-fields">
          {/* <h3>{selectedType} Questions</h3> */}
          {questions[selectedType].map((question, index) => (
            <div className="form-group" key={index}>
              <label className="form-label">{question}</label>
              {question.toLowerCase().includes("upload") ? (
                <input
                  type="file"
                  onChange={(e) => handleChange(e, question)}
                  className="form-input"
                />
              ) : (
                <input
                  type="text"
                  value={formData[question] || ""}
                  onChange={(e) => handleChange(e, question)}
                  className="form-input"
                />
              )}
            </div>
          ))}
          <button type="submit" className="form-submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default OnlinePaymentFraud;
