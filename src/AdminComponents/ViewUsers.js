import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../AdminStyles.css"; // You can create this for custom admin styles

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Check if logged in user is admin
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');
        
        if (!userEmail || !userRole || userRole.toLowerCase() !== 'admin') {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          navigate('/');
          return;
        }

        console.log('Fetching users...');
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
          setError(null);
        } else {
          throw new Error(data.message || 'Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading">Loading users data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-section">
        <div className="error">
          <p>{error}</p>
          <button 
            className="retry-btn" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="page-header">
        <h2>Registered Users</h2>
        <p className="total-users">Total Users: {users.length}</p>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id || index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-results">
                No users found in the database
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewUsers;
