import React, { useState } from "react";
import "../ViewEvidence.css";

function ViewEvidence() {
  const [trackId, setTrackId] = useState("");
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = async () => {
    if (!trackId.trim()) {
      setError("Please enter a Track ID");
      return;
    }

    setLoading(true);
    setError("");
    setShowDetails(false);
    try {
      const response = await fetch(`http://localhost:5000/api/track-report/${trackId}`);
      const data = await response.json();
      
      if (data.success) {
        console.log("Report data:", data.report); // Debug log
        setReportData(data.report);
      } else {
        setReportData(null);
        setError(data.message || "No report found with that Track ID.");
      }
    } catch (err) {
      setError("Failed to fetch report. Please try again.");
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/200x200?text=Image+Not+Found";
  };

  const getFileIcon = (fileType) => {
    if (fileType?.toLowerCase().includes('pdf')) return '📄';
    if (fileType?.toLowerCase().includes('image')) return '🖼️';
    if (fileType?.toLowerCase().includes('video')) return '🎥';
    if (fileType?.toLowerCase().includes('audio')) return '🎵';
    if (fileType?.toLowerCase().includes('text')) return '📝';
    return '📎';
  };

  const decodeBase64 = (base64String) => {
    try {
      return atob(base64String);
    } catch (e) {
      console.error('Error decoding base64:', e);
      return 'Error decoding file content';
    }
  };

  const renderBasicInfo = () => {
    return (
      <div className="basic-info-card">
        <div className="basic-info-header">
          <h3>Case #{reportData.trackingId}</h3>
          <button 
            className="view-details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>
        </div>
        <div className="basic-info-grid">
          <div className="info-item">
            <strong>Fraud Type:</strong>
            <span>{reportData.fraudType}</span>
          </div>
          <div className="info-item">
            <strong>Sub Type:</strong>
            <span>{reportData.subType}</span>
          </div>
          <div className="info-item">
            <strong>Status:</strong>
            <span className={`status-badge ${reportData.status}`}>{reportData.status}</span>
          </div>
          <div className="info-item">
            <strong>Priority:</strong>
            <span className={`priority-badge ${reportData.priority}`}>{reportData.priority}</span>
          </div>
          <div className="info-item">
            <strong>Date Submitted:</strong>
            <span>{new Date(reportData.dateSubmitted).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderEvidence = (file) => {
    if (!file) return null;
    
    const fileType = file.type?.toLowerCase() || '';
    const fileContent = file.content ? decodeBase64(file.content) : null;
    
    if (fileType.includes('image')) {
      return (
        <div className="evidence-item" key={file.filename}>
          <div className="image-container" onClick={() => setSelectedFile(file)}>
            <img 
              src={`data:${file.type};base64,${file.content}`}
              alt={file.filename}
              className="evidence-image"
              onError={handleImageError}
            />
            <div className="image-overlay">
              <span>Click to preview</span>
            </div>
          </div>
          <p className="file-name">
            <span className="file-icon">{getFileIcon(fileType)}</span>
            {file.filename}
          </p>
        </div>
      );
    } else if (fileType.includes('text')) {
      return (
        <div className="evidence-item text-evidence" key={file.filename}>
          <div className="text-preview" onClick={() => setSelectedFile(file)}>
            <pre className="text-content">
              {fileContent ? fileContent.slice(0, 100) + '...' : 'No content available'}
            </pre>
          </div>
          <p className="file-name">
            <span className="file-icon">{getFileIcon(fileType)}</span>
            {file.filename}
          </p>
          <button 
            className="view-file-btn"
            onClick={() => setSelectedFile(file)}
          >
            View Full Content
          </button>
        </div>
      );
    } else {
      return (
        <div className="evidence-item" key={file.filename}>
          <div className="file-icon-large">{getFileIcon(fileType)}</div>
          <p className="file-name">{file.filename}</p>
          <button 
            className="view-file-btn"
            onClick={() => setSelectedFile(file)}
          >
            View File
          </button>
        </div>
      );
    }
  };

  const renderCaseDetails = () => {
    if (!showDetails) return null;

    return (
      <div className="case-details-section">
        <div className="citizen-responses">
          <h3>Case Information</h3>
          <div className="qa-grid">
            {reportData.details && Object.entries(reportData.details).map(([key, value], index) => {
              if (key === 'evidence_files' || value == null || typeof value === 'object') return null;
              return (
                <div key={index} className="qa-item">
                  <div className="question">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                  <div className="answer">{value.toString()}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="evidence-section">
          <h3>Evidence Files</h3>
          {reportData.details?.evidence_files?.length > 0 ? (
            <>
              <div className="evidence-grid">
                {reportData.details.evidence_files.map((file, index) => (
                  file && <div key={index} className="evidence-wrapper">
                    {renderEvidence(file)}
                  </div>
                ))}
              </div>
              <p className="evidence-help-text">Click on any image to view in full size</p>
            </>
          ) : (
            <p className="no-evidence">No evidence files attached to this report.</p>
          )}
        </div>

        {(reportData.notes || reportData.resolution) && (
          <div className="case-status">
            <h3>Case Status Updates</h3>
            <div className="status-details">
              {reportData.notes && (
                <div className="notes-section">
                  <h4>Investigation Notes</h4>
                  <p>{reportData.notes}</p>
                </div>
              )}
              {reportData.resolution && (
                <div className="resolution-section">
                  <h4>Case Resolution</h4>
                  <p>{reportData.resolution}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="evidence-container">
      <h2>Case Details and Evidence</h2>
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Track ID"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {reportData && (
        <div className="case-container">
          {renderBasicInfo()}
          {renderCaseDetails()}
        </div>
      )}

      {selectedFile && (
        <div className="file-preview-overlay" onClick={() => setSelectedFile(null)}>
          <div className="file-preview-container">
            {selectedFile.type?.toLowerCase().includes('image') ? (
              <img 
                src={`data:${selectedFile.type};base64,${selectedFile.content}`}
                alt={selectedFile.filename}
                onError={handleImageError}
              />
            ) : (
              <div className="text-file-preview">
                <h3>{selectedFile.filename}</h3>
                <pre>{decodeBase64(selectedFile.content)}</pre>
              </div>
            )}
            <button className="close-preview" onClick={() => setSelectedFile(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewEvidence;
