import React, { useState } from "react";
import "../TrackSearch.css";

function TrackSearch() {
  const [trackId, setTrackId] = useState("");
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!trackId.trim()) {
      setError("Please enter a Track ID");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/api/track-report/${trackId}`);
      const data = await response.json();
      
      if (data.success) {
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

  return (
    <div className="track-container">
      <h2>Search Report by Track ID</h2>
      <div className="track-input-group">
        <input
          type="text"
          placeholder="Enter Track ID"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {reportData && (
        <div className="report-card">
          <p><strong>Tracking ID:</strong> {reportData.trackingId}</p>
          <p><strong>Fraud Type:</strong> {reportData.fraudType}</p>
          <p><strong>Sub Type:</strong> {reportData.subType}</p>
          <p><strong>Status:</strong> {reportData.status}</p>
          <p><strong>Priority:</strong> {reportData.priority}</p>
          <p><strong>Date Submitted:</strong> {new Date(reportData.dateSubmitted).toLocaleString()}</p>
          {reportData.notes && <p><strong>Notes:</strong> {reportData.notes}</p>}
          {reportData.resolution && <p><strong>Resolution:</strong> {reportData.resolution}</p>}
        </div>
      )}
    </div>
  );
}

export default TrackSearch;
