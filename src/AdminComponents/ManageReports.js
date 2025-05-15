import React, { useState, useEffect } from "react";
import "../AdminStyles.css";

function ManageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (trackingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/track-report/${trackingId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedReport(data.report);
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  };

  const updateStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-report/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchReports(); // Refresh the list
        if (selectedReport && selectedReport.trackingId === reportId) {
          handleViewDetails(reportId); // Refresh the details view
        }
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  };

  const renderEvidenceFiles = (files) => {
    if (!files || files.length === 0) return null;

    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Evidence Files</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              {file.type?.toLowerCase().includes('image') ? (
                <div className="cursor-pointer" onClick={() => setSelectedImage(file)}>
                  <div className="relative h-48">
                    <img 
                      src={`data:${file.type};base64,${file.content}`}
                      alt={file.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                        Click to view
                      </span>
                    </div>
                  </div>
                  <div className="p-3 border-t">
                    <p className="text-sm font-medium text-gray-700">{file.filename}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-2">
                      {file.type?.toLowerCase().includes('pdf') ? '📄' : 
                       file.type?.toLowerCase().includes('text') ? '📝' : '📎'}
                    </span>
                    <p className="text-sm font-medium text-gray-700 text-center">
                      {file.filename}
                    </p>
                  </div>
                  {file.type?.toLowerCase().includes('text') && (
                    <div className="mt-3 p-2 bg-gray-50 rounded border text-sm font-mono max-h-32 overflow-y-auto">
                      {atob(file.content)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderImageModal = () => {
    if (!selectedImage) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
        onClick={() => setSelectedImage(null)}
      >
        <div className="max-w-4xl w-full bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-gray-800">{selectedImage.filename}</h4>
            <button 
              className="text-gray-600 hover:text-gray-800 text-xl"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
          <img 
            src={`data:${selectedImage.type};base64,${selectedImage.content}`}
            alt={selectedImage.filename}
            className="max-h-[80vh] w-full object-contain"
          />
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-reports p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Reports</h2>
        {selectedReport && (
          <button 
            onClick={() => setSelectedReport(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to List
          </button>
        )}
      </div>

      {selectedReport ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Case Details</h3>
              <div className="flex items-center gap-4">
                <select
                  value={selectedReport.status}
                  onChange={(e) => updateStatus(selectedReport.trackingId, e.target.value)}
                  className="px-3 py-1 border rounded-lg"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedReport.status.toLowerCase() === 'resolved' ? 'bg-green-100 text-green-800' :
                  selectedReport.status.toLowerCase() === 'in progress' ? 'bg-blue-100 text-blue-800' :
                  selectedReport.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedReport.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Track ID</p>
                  <p className="font-medium">{selectedReport.trackingId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Citizen Email</p>
                  <p className="font-medium">{selectedReport.citizenEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fraud Type</p>
                  <p className="font-medium">{selectedReport.fraudType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subtype</p>
                  <p className="font-medium">{selectedReport.subType}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Reported Date</p>
                  <p className="font-medium">
                    {new Date(selectedReport.dateSubmitted).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(selectedReport.lastUpdated).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <p className="font-medium">{selectedReport.priority || 'Normal'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="font-medium">{selectedReport.assignedTo || 'Unassigned'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Case Information */}
          {selectedReport.details && (
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Case Information</h3>
              <div className="grid gap-6">
                {Object.entries(selectedReport.details).map(([key, value], index) => {
                  if (key === 'evidence_files' || typeof value === 'object') return null;
                  return (
                    <div 
                      key={index} 
                      className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500"
                    >
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        {formatFieldName(key)}
                      </h4>
                      <p className="text-gray-600">
                        {typeof value === 'boolean' 
                          ? value ? 'Yes' : 'No'
                          : value === null || value === '' 
                          ? 'Not provided'
                          : value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Evidence Files */}
          {selectedReport.details?.evidence_files && 
            renderEvidenceFiles(selectedReport.details.evidence_files)}

          {/* Case Updates */}
          {(selectedReport.notes || selectedReport.resolution) && (
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Case Updates</h3>
              {selectedReport.notes && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Investigation Notes</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedReport.notes}
                  </p>
                </div>
              )}
              {selectedReport.resolution && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Resolution</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedReport.resolution}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.trackingId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.trackingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.fraudType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.citizenEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.dateSubmitted).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={report.status}
                      onChange={(e) => updateStatus(report.trackingId, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(report.trackingId)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Preview Modal */}
      {renderImageModal()}
    </div>
  );
}

export default ManageReports;
