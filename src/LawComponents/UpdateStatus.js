import React, { useState } from "react";
import "../UpdateStatus.css";

function UpdateStatus() {
  const [trackId, setTrackId] = useState("");
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!trackId.trim()) {
      setError("Please enter a Track ID");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-report/${trackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage("Report status updated successfully!");
        setTrackId("");
        setStatus("pending");
        setNotes("");
      } else {
        setError(data.message || "Failed to update report status");
      }
    } catch (err) {
      setError("Failed to update report. Please try again.");
      console.error("Error updating report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-status-container">
      <h2>Update Report Status</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Track ID:</label>
          <input
            type="text"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Status"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
    </div>
  );
}

export default UpdateStatus;
