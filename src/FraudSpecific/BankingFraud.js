// BankingFraud.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "../styleForms.css";

const questionsBySubtype = {
  "Fraud Call / Vishing": [
    "Did you receive a suspicious phone call asking for your bank details?",
    "What was the caller claiming to be (e.g., bank official)?",
    "Did you share any OTP, PIN, or password with the caller?",
    "What was the date and time of the call?",
    "Did the caller ask you to install any app?",
    "How much money did you lose (if any)?",
    "From which account was the money deducted?",
    "Have you reported this to your bank?",
    "Have you filed a police complaint?",
    "Upload call recording or screenshots (if any):*file"
  ],
  "Cheating by Impersonation": [
    "Who was impersonated (e.g., relative, police officer)?",
    "How did the impersonator contact you?",
    "What message did they convey?",
    "Did you transfer any money based on their request?",
    "What personal or financial details did you share?",
    "What made you believe they were genuine?",
    "When did you realize it was a fraud?",
    "Have you informed your bank?",
    "Have you taken any legal steps?",
    "Upload any chat/email/screenshots:*file"
  ],
  "Profile Hacking / Identity Theft": [
    "Which profile was hacked (e.g., Facebook, Instagram, bank)?",
    "When did you notice suspicious activity?",
    "What details were changed or misused?",
    "Did you lose access to your account?",
    "Have you reported the hack to the platform?",
    "Was your identity used for any financial fraud?",
    "Did anyone contact you about suspicious activities?",
    "Have you informed your contacts about the hack?",
    "Did you receive any phishing emails or links?",
    "Upload evidence (screenshots, phishing emails, etc.):*file"
  ],
  "Demat / Depository Fraud / Other Cyber": [
    "What kind of fraud occurred (Demat/Depository/Other)?",
    "Was any trading or financial activity done without your consent?",
    "Which trading or investment platform was used?",
    "Did you share your credentials with anyone?",
    "Was any fake investment scheme involved?",
    "Have you contacted the investment platform?",
    "Have you filed a complaint with SEBI or police?",
    "Any emails or messages from the fraudsters?",
    "How much financial loss have you faced?",
    "Upload related documents or screenshots:*file"
  ],
  "Online Matrimonial Fraud": [
    "Which matrimonial site or app was used?",
    "How did the fraudster approach you?",
    "Did they gain your trust by sharing fake documents/photos?",
    "Did they ask for money under emotional or emergency reasons?",
    "How much amount did you transfer?",
    "Did they suddenly stop responding or block you?",
    "Have you informed the matrimonial platform?",
    "Did you report the bank account or UPI ID used?",
    "Have you approached the police or cyber cell?",
    "Upload screenshots, chat history, or fake documents:*file"
  ]
};

const BankingFraud = () => {
  const navigate = useNavigate(); // Add this hook
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e, index) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Content = event.target.result.split(',')[1]; // Remove data URL prefix
          setFormData(prev => ({
            ...prev,
            [index]: {
              file: file,
              base64: base64Content
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [index]: e.target.value });
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
        const question = questionsBySubtype[selectedSubtype][parseInt(key)];
        if (value && typeof value === 'object' && value.file) {
          // Skip file objects in details
          return;
        }
        formattedDetails[question] = value;
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
        fraudType: 'Banking Fraud',
        subType: selectedSubtype,
        details: formattedDetails,
        status: 'pending',
        attachments: attachments,
        priority: 'normal',
        notes: ''
      };

      console.log('Sending report data:', reportData); // Debug log

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

  const subtypes = Object.keys(questionsBySubtype);

  return (
    <div className="form-container">
      <h2 className="form-title">Banking Fraud Report</h2>

      <label htmlFor="subtypeSelect">Select type of banking fraud:</label>
      <select
        id="subtypeSelect"
        className="form-input"
        value={selectedSubtype}
        onChange={(e) => {
          setSelectedSubtype(e.target.value);
          setFormData({});
        }}
      >
        <option value="">-- Select --</option>
        {subtypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {selectedSubtype && (
        <form onSubmit={handleSubmit}>
          <div className="question-set">
            {questionsBySubtype[selectedSubtype].map((question, index) => {
              const isFileInput = question.endsWith("*file");
              const displayQuestion = question.replace("*file", "");
              return (
                <div key={index} className="form-group">
                  <label className="form-label">{displayQuestion}</label>
                  {isFileInput ? (
                    <input
                      type="file"
                      onChange={(e) => handleChange(e, index)}
                      className="form-input"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[index] || ""}
                      onChange={(e) => handleChange(e, index)}
                      className="form-input"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <button type="submit" className="form-submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BankingFraud;
