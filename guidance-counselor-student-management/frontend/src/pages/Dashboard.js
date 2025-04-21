import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../css/styles.css';

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="background">
      <div className="dashboard-container">
        <h1>Welcome to the Guidance System</h1>
        <p>Manage student records and offenses efficiently.</p>
        <div className="button-container">
          <button onClick={() => navigate('/manage-students-by-grade')}>Manage Students</button>
          <button onClick={() => navigate('/records')}>Manage Records</button>
          <button onClick={() => navigate('/addreport')}>Add Report</button>
          <button onClick={() => navigate('/analytics')}>Analytics</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;