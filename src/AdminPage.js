import React, { useState } from "react";
import './LawPage.css'; // Reused styling for sidebar and layout

import ViewUsers from "./AdminComponents/ViewUsers";
import ManageReports from "./AdminComponents/ManageReports";
import SendNews from "./AdminComponents/SendNews"; // Renamed for clarity

function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <ViewUsers />;
      case "reports":
        return <ManageReports />;
      case "news":
        return <SendNews />;
      default:
        return (
          <div className="dashboard-content">
            <h2>Welcome to the Admin Dashboard</h2>
            <p>Use the sidebar to navigate through admin functions.</p>
          </div>
        );
    }
  };

  return (
    <div className="law-dashboard">
      <aside className="law-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard Home
          </li>
          <li
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            View Registered Users
          </li>
          <li
            className={activeSection === "reports" ? "active" : ""}
            onClick={() => setActiveSection("reports")}
          >
            Manage Reports
          </li>
          <li
            className={activeSection === "news" ? "active" : ""}
            onClick={() => setActiveSection("news")}
          >
            Send News Update
          </li>
        </ul>
      </aside>

      <main className="law-main-content">{renderSection()}</main>
    </div>
  );
}

export default AdminPage;
