import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/styles.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem('authToken');
    // Redirect to the Login page
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h1 className="white">BSSAA Guidance Hub</h1>
      <div>
        <a href="/">Dashboard</a>
        <a href="/manage-students-by-grade">Students</a>
        <a href="/records">Records</a>
        <a href="/analytics">Analytics</a>
        <button onClick={handleLogout} style={{ marginLeft: '10px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;