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
        <a href="/">Main Menu</a>
        <a href="/manage-students-by-grade">Student Information</a>
        <a href="/records">Offense Records</a>
        <a href="/sort-and-manage">Update Records</a> {/* New link added */}
        <a href="/analytics">Analytics</a>
        <button onClick={handleLogout} style={{ marginLeft: '10px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;