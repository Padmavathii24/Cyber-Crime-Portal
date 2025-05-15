import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginRegister.css";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("citizen");
  const [error, setError] = useState("");

  // Common state for all fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    badgeId: "",
    department: "",
    officialEmail: "",
    adminCode: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: role === 'law' ? formData.officialEmail : formData.email,
          password: formData.password,
          role: role,
          name: formData.fullName,
          badgeId: formData.badgeId,
          adminCode: formData.adminCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration successful! Please login.');
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="portal-heading">Cyber Crime Reporting Portal</div>
      {error && <div className="error-message" style={{color: 'red', margin: '10px'}}>{error}</div>}
      <form className="auth-form" onSubmit={handleRegister}>
        <h2 className="auth-title">Register</h2>

        {/* Role Selection */}
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="citizen">Citizen</option>
          <option value="law">Law Enforcement</option>
          <option value="admin">Admin</option>
        </select>

        {/* Common Fields */}
        <label>Full Name</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

        {/* Role Specific Fields */}
        {role === "citizen" && (
          <>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </>
        )}

        {role === "law" && (
          <>
            <label>Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />

            <label>Badge/ID Number</label>
            <input type="text" name="badgeId" value={formData.badgeId} onChange={handleChange} required />

            <label>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required />

            <label>Official Email</label>
            <input type="email" name="officialEmail" value={formData.officialEmail} onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </>
        )}

        {role === "admin" && (
          <>
            <label>Admin Code</label>
            <input type="text" name="adminCode" value={formData.adminCode} onChange={handleChange} required />

            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </>
        )}

        <button type="submit" className="auth-btn">Register</button>

        <p className="auth-link">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
