import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';  // Changed from './Navbar' to '../Navbar'

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/reports');
      const data = await response.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-report/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(report => report.status === filter);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Manage Reports</h2>
        
        {/* Filter controls */}
        <div className="mb-6">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Reports table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="p-3 border">Tracking ID</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Subtype</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.trackingId}>
                  <td className="p-3 border">{report.trackingId}</td>
                  <td className="p-3 border">{report.fraudType}</td>
                  <td className="p-3 border">{report.subType}</td>
                  <td className="p-3 border">{report.dateSubmitted}</td>
                  <td className="p-3 border">
                    <select
                      value={report.status}
                      onChange={(e) => updateStatus(report.trackingId, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => window.location.href = `/admin/report/${report.trackingId}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;