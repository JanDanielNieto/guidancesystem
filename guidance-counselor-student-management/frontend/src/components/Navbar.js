import React from 'react';
import '../css/styles.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <h1>Guidance System</h1>
      <div>
        <a href="/">Dashboard</a>
        <a href="/students">Students</a>
        <a href="/offenses">Offenses</a>
      </div>
    </div>
  );
};

export default Navbar;