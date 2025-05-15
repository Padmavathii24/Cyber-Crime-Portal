import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginRegister.css";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("citizen");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    officialEmail: "",
    badgeId: "",
    adminCode: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: role === 'law' ? formData.officialEmail : formData.email,
          password: formData.password,
          role: role,
          adminCode: formData.adminCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user info in localStorage
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userEmail', data.email);
        
        // Navigate based on role
        if (role === "citizen") {
          navigate("/landing");
        } else if (role === "law") {
          navigate("/law");
        } else if (role === "admin") {
          navigate("/admin");
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="portal-heading">Cyber Crime Reporting Portal</div>
      {error && <div className="error-message" style={{color: 'red', margin: '10px'}}>{error}</div>}
      <form className="auth-form" onSubmit={handleLogin}>
        <h2 className="auth-title">Login</h2>

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="citizen">Citizen</option>
          <option value="law">Law Enforcement</option>
          <option value="admin">Admin</option>
        </select>

        {/* Role-Based Fields */}
        {role === "citizen" && (
          <>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </>
        )}

        {role === "law" && (
          <>
            <label>Official Email</label>
            <input type="email" name="officialEmail" value={formData.officialEmail} onChange={handleChange} required />

            <label>Badge/ID Number</label>
            <input type="text" name="badgeId" value={formData.badgeId} onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </>
        )}

        {role === "admin" && (
          <>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Admin Code</label>
            <input type="text" name="adminCode" value={formData.adminCode} onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </>
        )}

        <button type="submit" className="auth-btn">Login</button>

        <p className="auth-link">
          Don't have a login? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
