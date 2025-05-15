import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Track = () => {
  const [trackId, setTrackId] = useState("");
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userReports, setUserReports] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Fetch user's reports when component mounts
  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setErrorMessage('Please login first');
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/citizen-reports/${userEmail}`);
      const data = await response.json();
      
      if (data.success) {
        setUserReports(data.reports);
      } else {
        setErrorMessage(data.message || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setErrorMessage('Failed to fetch reports. Please try again.');
    }
  };

  const handleTrack = async () => {
    if (!trackId.trim()) {
      setErrorMessage("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`http://localhost:5000/api/track-report/${trackId}`);
      const data = await response.json();

      if (data.success) {
        setCaseDetails(data.report);
        setErrorMessage("");
      } else {
        setCaseDetails(null);
        setErrorMessage(data.message || "Track ID not found. Please enter a valid ID.");
      }
    } catch (error) {
      console.error('Error tracking report:', error);
      setErrorMessage("Failed to fetch report details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCaseClick = async (report) => {
    setTrackId(report.trackingId);
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`http://localhost:5000/api/track-report/${report.trackingId}`);
      const data = await response.json();

      if (data.success) {
        setCaseDetails(data.report);
        setErrorMessage("");
      } else {
        setCaseDetails(null);
        setErrorMessage(data.message || "Failed to fetch case details.");
      }
    } catch (error) {
      console.error('Error fetching case details:', error);
      setErrorMessage("Failed to fetch case details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'text-green-600';
      case 'in progress':
      case 'investigating':
      case 'under_investigation':
        return 'text-yellow-600';
      case 'pending':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  };

  const renderCaseInformation = (details) => {
    if (!details) return null;

    // Filter out evidence_files and format the remaining fields
    const fieldsToShow = Object.entries(details).filter(([key, value]) => 
      key !== 'evidence_files' && key !== 'id' && key !== 'report_id' && typeof value !== 'object'
    );

    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Case Information</h3>
        <div className="grid gap-6">
          {fieldsToShow.map(([key, value], index) => {
            // Convert value to string representation
            const displayValue = (() => {
              if (value === null || value === '') return 'Not provided';
              if (typeof value === 'boolean') return value ? 'Yes' : 'No';
              if (Array.isArray(value)) return value.join(', ');
              return String(value);
            })();

            return (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500"
              >
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  {formatFieldName(key)}
                </h4>
                <p className="text-gray-600">{displayValue}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEvidenceFiles = (files) => {
    if (!Array.isArray(files) || files.length === 0) return null;

    const renderFile = (file, index) => {
      if (!file || typeof file !== 'object') return null;

      // Convert file object properties to string representation if needed
      const fileInfo = {
        name: String(file.name || file.filename || 'Untitled'),
        type: String(file.type || ''),
        size: file.size ? `${Math.round(file.size / 1024)} KB` : '',
        content: file.content || '',
        uploaded: file.uploaded_at ? new Date(file.uploaded_at).toLocaleString() : ''
      };

      const fileType = fileInfo.type.toLowerCase();
      const isImage = fileType.includes('image');
      const isPdf = fileType.includes('pdf');
      const isText = fileType.includes('text');

      const FileIcon = () => (
        <span className="text-3xl mb-2" role="img" aria-label="file icon">
          {isPdf ? '📄' : isText ? '📝' : '📎'}
        </span>
      );

      const FileDetails = () => (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-700 text-center break-all">
            {fileInfo.name}
          </p>
          {fileInfo.size && (
            <p className="text-xs text-gray-500 text-center">{fileInfo.size}</p>
          )}
          {fileInfo.uploaded && (
            <p className="text-xs text-gray-500 text-center">{fileInfo.uploaded}</p>
          )}
        </div>
      );

      return (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
        >
          {isImage ? (
            <div className="cursor-pointer h-full" onClick={() => setSelectedImage(fileInfo)}>
              <div className="relative h-48">
                <img 
                  src={fileInfo.content ? `data:${fileInfo.type};base64,${fileInfo.content}` : 'https://via.placeholder.com/150?text=Image+Error'}
                  alt={fileInfo.name}
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
                <FileDetails />
              </div>
            </div>
          ) : (
            <div className="p-4 h-full flex flex-col">
              <div className="flex flex-col items-center flex-grow">
                <FileIcon />
                <FileDetails />
              </div>
              {isText && fileInfo.content && (
                <div className="mt-3 p-2 bg-gray-50 rounded border text-sm font-mono max-h-32 overflow-y-auto">
                  {(() => {
                    try {
                      return atob(fileInfo.content);
                    } catch (e) {
                      return 'Unable to decode file content';
                    }
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Evidence Files</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => renderFile(file, index))}
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
        <div 
          className="max-w-4xl w-full bg-white rounded-lg p-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-gray-800">{selectedImage.name}</h4>
            <button 
              className="text-gray-600 hover:text-gray-800 text-xl"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
          <img 
            src={selectedImage.content ? `data:${selectedImage.type};base64,${selectedImage.content}` : 'https://via.placeholder.com/400?text=Image+Error'}
            alt={selectedImage.name}
            className="max-h-[80vh] w-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400?text=Image+Error';
            }}
          />
          {selectedImage.uploaded && (
            <p className="text-sm text-gray-500 mt-2">
              Uploaded: {selectedImage.uploaded}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Track Your Case</h2>
        
        {/* Search Section */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Enter Track ID:
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Enter Track ID"
            />
            <button
              onClick={handleTrack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Tracking..." : "Track Case"}
            </button>
          </div>

          {/* User's Recent Cases */}
          {userReports.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Your Recent Cases:</h4>
              <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
                {userReports.map((report) => (
                  <div
                    key={report.trackingId}
                    onClick={() => handleCaseClick(report)}
                    className="p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{report.trackingId}</span>
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(report.status)}`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {report.fraudType} - {report.subType}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Reported on: {new Date(report.dateSubmitted).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-block text-blue-600">Loading...</div>
          </div>
        )}
        
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* Case Details */}
        {caseDetails && (
          <div className="mt-6">
            {/* Basic Information */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Case Details</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseDetails.status)}`}>
                  {caseDetails.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Track ID</p>
                    <p className="font-medium">{caseDetails.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fraud Type</p>
                    <p className="font-medium">{caseDetails.fraudType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subtype</p>
                    <p className="font-medium">{caseDetails.subType}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Reported Date</p>
                    <p className="font-medium">
                      {new Date(caseDetails.dateSubmitted).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <p className="font-medium">{caseDetails.priority || 'Normal'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {new Date(caseDetails.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Information */}
            {caseDetails.details && renderCaseInformation(caseDetails.details)}

            {/* Evidence Files */}
            {caseDetails.details?.evidence_files && 
              renderEvidenceFiles(caseDetails.details.evidence_files)}

            {/* Case Updates */}
            {(caseDetails.notes || caseDetails.resolution) && (
              <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Case Updates</h3>
                {caseDetails.notes && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">Investigation Notes</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {caseDetails.notes}
                    </p>
                  </div>
                )}
                {caseDetails.resolution && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Resolution</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {caseDetails.resolution}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Image Preview Modal */}
        {renderImageModal()}
      </div>
    </div>
  );
};

export default Track;
