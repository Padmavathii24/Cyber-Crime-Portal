import React, { useEffect, useState } from "react";
import "../AllReports.css";

function AllReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      console.log('Fetched reports:', data); // Debug log
      
      if (data.success) {
        setReports(data.reports);
      } else {
        throw new Error(data.message || 'Failed to fetch reports');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="all-reports">
        <div className="loading">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-reports">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="all-reports">
      <div className="reports-header">
        <h2>All Citizen Reports ({reports.length})</h2>
      </div>

      {reports.length > 0 ? (
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Fraud Type</th>
                <th>Sub Type</th>
                <th>Reported By</th>
                <th>Reported Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.tracking_id}>
                  <td>{report.tracking_id}</td>
                  <td>{report.fraud_type}</td>
                  <td>{report.sub_type || 'N/A'}</td>
                  <td>{report.citizen_email}</td>
                  <td>{formatDate(report.date_submitted)}</td>
                  <td>
                    <span className={`status-badge ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${report.priority.toLowerCase()}`}>
                      {report.priority}
                    </span>
                  </td>
                  <td>{report.assigned_to || 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-reports">No reports found</div>
      )}
    </div>
  );
}

export default AllReports;
