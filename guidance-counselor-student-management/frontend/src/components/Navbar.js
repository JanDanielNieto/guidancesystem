import React from 'react';
import '../css/styles.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <h1 className="white">BSSAA Guidance Hub</h1>
      <div>
        <a href="/">Dashboard</a>
        <a href="/manage-students-by-grade">Students</a> {/* Updated link to ManageStudentsByGrade */}
        <a href="/records">Records</a>
        <a href="/analytics">Analytics</a>
      </div>
    </div>
  );
};

export default Navbar;