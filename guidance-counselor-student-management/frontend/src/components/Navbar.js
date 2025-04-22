import React from 'react';
import '../css/styles.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <h1>Guidance System</h1>
      <div>
        <a href="/">Dashboard</a>
        <a href="/students">Students</a>
        <a href="/records">Records</a>
        <a href="/analytics">Analytics</a>
      </div>
    </div>
  );
};

export default Navbar;