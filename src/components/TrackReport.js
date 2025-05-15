import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';

const TrackReport = () => {
  const [trackingId, setTrackingId] = useState('');
  const [report, setReport] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all reports for the logged-in citizen
    const fetchAllReports = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        setError('Please login first');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/citizen-reports/${userEmail}`);
        const data = await response.json();
        
        if (data.success) {
          setAllReports(data.reports);
        } else {
          setError(data.message || 'Failed to fetch reports');
        }
      } catch (error) {
        setError('Error connecting to server. Please try again.');
        console.error('Error:', error);
      }
    };

    fetchAllReports();
  }, []);

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);

    try {
      const response = await fetch(`http://localhost:5000/api/track-report/${trackingId}`);
      const data = await response.json();

      if (data.success) {
        setReport(data.report);
        setError('');
      } else {
        setError(data.message || 'Failed to find report');
        setReport(null);
      }
    } catch (error) {
      setError('Error connecting to server. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Track Your Reports</h2>

          {/* Search by ID Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-bold mb-4">Search by Tracking ID</h3>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter Tracking ID"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleTrack}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>

            {error && (
              <div className="text-red-500 p-3 bg-red-50 rounded">
                {error}
              </div>
            )}

            {report && (
              <div className="mt-4 bg-gray-50 p-4 rounded">
                <h3 className="text-xl font-bold mb-4">Report Details</h3>
                <div className="space-y-3">
                  <p><span className="font-semibold">Tracking ID:</span> {report.trackingId}</p>
                  <p><span className="font-semibold">Type:</span> {report.fraudType}</p>
                  <p><span className="font-semibold">Subtype:</span> {report.subType}</p>
                  <p><span className="font-semibold">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </p>
                  <p><span className="font-semibold">Date Submitted:</span> {report.dateSubmitted}</p>
                </div>
              </div>
            )}
          </div>

          {/* All Reports Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Your Reported Cases</h3>
            {allReports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="p-3 border">Tracking ID</th>
                      <th className="p-3 border">Type</th>
                      <th className="p-3 border">Subtype</th>
                      <th className="p-3 border">Date Submitted</th>
                      <th className="p-3 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allReports.map((report) => (
                      <tr key={report.trackingId} className="hover:bg-gray-50">
                        <td className="p-3 border">{report.trackingId}</td>
                        <td className="p-3 border">{report.fraudType}</td>
                        <td className="p-3 border">{report.subType}</td>
                        <td className="p-3 border">{report.dateSubmitted}</td>
                        <td className="p-3 border">
                          <span className={`px-2 py-1 rounded ${
                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                            report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {report.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No reports found. Submit a report to see it here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackReport;