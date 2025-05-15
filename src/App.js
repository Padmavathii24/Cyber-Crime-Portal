import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Landing from "./Landing";
import ReportPage from "./ReportPage";
import Track from "./Track";
import UpdatePage from "./UpdatePage";
import NewsPage from './NewsPage';

import Login from './Login';
import Register from './Register';
import LawPage from './LawPage';
import AdminPage from './AdminPage';

import OnlinePaymentFraud from "./FraudSpecific/OnlinePaymentFraud";
import JobFraud from './FraudSpecific/JobFraud';
import BankingFraud from "./FraudSpecific/BankingFraud";
import Others from './FraudSpecific/Others';

import TrackReport from './components/TrackReport';
import AdminDashboard from './components/AdminDashboard';

function LayoutWrapper({ children }) {
  const location = useLocation();

  // Hide Navbar for login, register, law and admin
  const hideNavbarRoutes = ['/', '/register', '/law', '/admin'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>

          {/* Login & Register Pages */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Separate Law & Admin Dashboards */}
          <Route path="/law" element={<LawPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Citizen Routes with Navbar */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report/onlinepaymentfraud" element={<OnlinePaymentFraud />} />
          <Route path="/report/jobfraud" element={<JobFraud />} />
          <Route path="/report/BankingFraud" element={<BankingFraud />} />
          <Route path="/report/others" element={<Others />} />
          <Route path="/track" element={<Track />} />
          <Route path="/track-report" element={<TrackReport />} />
          <Route path="/update" element={<UpdatePage />} />
          <Route path="/news" element={<NewsPage />} />

        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
