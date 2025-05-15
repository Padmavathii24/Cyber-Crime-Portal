// OthersFraud.js

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styleForms.css";

const OthersFraud = () => {
  const navigate = useNavigate();
  const [fraudType, setFraudType] = useState('');
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFraudChange = (e) => {
    setFraudType(e.target.value);
    setFormData({});
  };

  const handleInputChange = (e, field) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Content = event.target.result.split(',')[1]; // Remove data URL prefix
          setFormData(prev => ({
            ...prev,
            [field]: {
              file: file,
              base64: base64Content
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
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
        fraudType: 'Other',
        subType: fraudType,
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

  const renderQuestions = () => {
    switch (fraudType) {
      case 'Cyber Bullying / Stalking / Sexting':
        return (
          <>
            <label>1. Describe what happened in detail:</label>
            <textarea 
              rows="4" 
              value={formData.description || ''}
              onChange={(e) => handleInputChange(e, 'description')}
            />

            <label>2. Where did the incident occur? (e.g., Instagram, WhatsApp, etc.)</label>
            <input 
              type="text" 
              value={formData.platform || ''}
              onChange={(e) => handleInputChange(e, 'platform')}
            />

            <label>3. When did it happen?</label>
            <input 
              type="date" 
              value={formData.date || ''}
              onChange={(e) => handleInputChange(e, 'date')}
            />

            <label>4. Do you know the person who did this?</label>
            <input 
              type="text" 
              value={formData.perpetrator || ''}
              onChange={(e) => handleInputChange(e, 'perpetrator')}
            />

            <label>5. Did the person threaten or harm you?</label>
            <input 
              type="text" 
              value={formData.threats || ''}
              onChange={(e) => handleInputChange(e, 'threats')}
            />

            <label>6. Upload any screenshots or evidence:</label>
            <input 
              type="file" 
              onChange={(e) => handleInputChange(e, 'evidence')}
            />

            <label>7. Have you reported this on the platform (e.g., blocked the user)?</label>
            <input 
              type="text" 
              value={formData.platformReport || ''}
              onChange={(e) => handleInputChange(e, 'platformReport')}
            />
          </>
        );

      case 'Provocative Speech for Unlawful Acts':
        return (
          <>
            <label>1. What kind of speech or post was it?</label>
            <textarea 
              rows="4" 
              value={formData.speechType || ''}
              onChange={(e) => handleInputChange(e, 'speechType')}
            />

            <label>2. Where was it posted? (e.g., Twitter, Facebook)</label>
            <input 
              type="text" 
              value={formData.platform || ''}
              onChange={(e) => handleInputChange(e, 'platform')}
            />

            <label>3. When did you see this post?</label>
            <input 
              type="date" 
              value={formData.date || ''}
              onChange={(e) => handleInputChange(e, 'date')}
            />

            <label>4. Do you know who posted it?</label>
            <input 
              type="text" 
              value={formData.poster || ''}
              onChange={(e) => handleInputChange(e, 'poster')}
            />

            <label>5. Did it encourage violence or hate?</label>
            <input 
              type="text" 
              value={formData.violenceEncouragement || ''}
              onChange={(e) => handleInputChange(e, 'violenceEncouragement')}
            />

            <label>6. Upload a screenshot or link to the post:</label>
            <input 
              type="file" 
              onChange={(e) => handleInputChange(e, 'evidence')}
            />
          </>
        );

      case 'Cyber Terrorism':
        return (
          <>
            <label>1. Describe the incident in detail:</label>
            <textarea 
              rows="4" 
              value={formData.description || ''}
              onChange={(e) => handleInputChange(e, 'description')}
            />

            <label>2. What platforms or websites were involved?</label>
            <input 
              type="text" 
              value={formData.platforms || ''}
              onChange={(e) => handleInputChange(e, 'platforms')}
            />

            <label>3. When did you discover this?</label>
            <input 
              type="date" 
              value={formData.date || ''}
              onChange={(e) => handleInputChange(e, 'date')}
            />

            <label>4. Upload any evidence or screenshots:</label>
            <input 
              type="file" 
              onChange={(e) => handleInputChange(e, 'evidence')}
            />

            <label>5. Have you reported this elsewhere?</label>
            <input 
              type="text" 
              value={formData.otherReports || ''}
              onChange={(e) => handleInputChange(e, 'otherReports')}
            />
          </>
        );

      case 'Demat / Depository Fraud / Other Cyber':
        return (
          <>
            <label>1. Describe the fraud in detail:</label>
            <textarea 
              rows="4" 
              value={formData.description || ''}
              onChange={(e) => handleInputChange(e, 'description')}
            />

            <label>2. Which demat/trading platform was involved?</label>
            <input 
              type="text" 
              value={formData.platform || ''}
              onChange={(e) => handleInputChange(e, 'platform')}
            />

            <label>3. When did the fraud occur?</label>
            <input 
              type="date" 
              value={formData.date || ''}
              onChange={(e) => handleInputChange(e, 'date')}
            />

            <label>4. How much money was involved?</label>
            <input 
              type="number" 
              value={formData.amount || ''}
              onChange={(e) => handleInputChange(e, 'amount')}
            />

            <label>5. Upload any relevant documents or screenshots:</label>
            <input 
              type="file" 
              onChange={(e) => handleInputChange(e, 'evidence')}
            />

            <label>6. Have you contacted your broker/depository?</label>
            <input 
              type="text" 
              value={formData.brokerContact || ''}
              onChange={(e) => handleInputChange(e, 'brokerContact')}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <h2>Report Other Types of Fraud</h2>

      <label>Select the type of fraud:</label>
      <select value={fraudType} onChange={handleFraudChange}>
        <option value="">-- Select --</option>
        <option value="Cyber Bullying / Stalking / Sexting">Cyber Bullying / Stalking / Sexting</option>
        <option value="Provocative Speech for Unlawful Acts">Provocative Speech for Unlawful Acts</option>
        <option value="Cyber Terrorism">Cyber Terrorism</option>
        <option value="Demat / Depository Fraud / Other Cyber">Demat / Depository Fraud / Other Cyber</option>
      </select>

      {fraudType && (
        <form onSubmit={handleSubmit} className="fraud-form">
          {renderQuestions()}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default OthersFraud;
