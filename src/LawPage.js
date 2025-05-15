import React, { useState } from "react";
import "./LawPage.css";
import AllReports from "./LawComponents/AllReports";
import TrackSearch from "./LawComponents/TrackSearch"
import UpdateStatus from './LawComponents/UpdateStatus';
import ViewEvidence from './LawComponents/ViewEvidence'; 


function LawPage() {
  const [selectedSection, setSelectedSection] = useState("dashboard");

  const renderSection = () => {
    switch (selectedSection) {
      case "reports":
        return <AllReports />;
      case "track":
        return <TrackSearch />; 
      case "updateStatus":
        return <UpdateStatus />;
      case "viewEvidence":
        return <ViewEvidence />;                             
      case "dashboard":
      default:
        return <p className="welcome-text">Welcome to the Law Enforcement Dashboard. Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="law-page-container">
      <aside className="law-sidebar">
        <h2>Law Dashboard</h2>
        <ul>
          <li onClick={() => setSelectedSection("dashboard")}>Home</li>
          <li onClick={() => setSelectedSection("reports")}>View All Reports</li>
          <li onClick={() => setSelectedSection("track")}>Search by Track ID</li>
          <li onClick={() => setSelectedSection("updateStatus")}>Update Report Status</li>
          <li onClick={() => setSelectedSection("viewEvidence")}>View Evidence Files</li>

          {/* Add more sidebar options here */}
        </ul>
      </aside>

      <main className="law-main-content">
        {renderSection()}
      </main>
    </div>
  );
}

export default LawPage;
