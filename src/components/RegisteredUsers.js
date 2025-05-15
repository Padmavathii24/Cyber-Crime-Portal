import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Check if logged in user is admin
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'admin') {
          alert('Access denied. Admin privileges required.');
          navigate('/');
          return;
        }

        const response = await fetch('http://localhost:5000/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
          setFilteredUsers(data.users);
        } else {
          throw new Error(data.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => {
      const searchValue = searchTerm.toLowerCase();
      switch (searchBy) {
        case 'name':
          return user.name.toLowerCase().includes(searchValue);
        case 'email':
          return user.email.toLowerCase().includes(searchValue);
        case 'role':
          return user.role.toLowerCase().includes(searchValue);
        default:
          return true;
      }
    });

    setFilteredUsers(filtered);
  }, [searchTerm, searchBy, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchBy('name');
  };

  if (loading) {
    return (
      <div className="admin-content">
        <div className="loading">Loading users data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-content">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div className="registered-users-container">
        <div className="page-header">
          <h2>Registered Users</h2>
          <p className="total-users">Total Users: {users.length}</p>
        </div>
        
        <div className="search-container">
          <div className="search-box">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder={`Search users by ${searchBy}...`}
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search" 
                  onClick={handleClearSearch}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            <select 
              value={searchBy} 
              onChange={handleSearchByChange}
              className="search-select"
            >
              <option value="name">Search by Name</option>
              <option value="email">Search by Email</option>
              <option value="role">Search by Role</option>
            </select>
          </div>
          <div className="search-results">
            {searchTerm && (
              <p>Found {filteredUsers.length} user(s) matching "{searchTerm}"</p>
            )}
          </div>
        </div>

        <div className="table-container">
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
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
                    {searchTerm ? 'No users found matching your search criteria' : 'No users found in the database'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegisteredUsers; 