import React from 'react';
import '../css/styles.css';

const Dashboard = () => {
  return (
    <div class="dashboard-container">
      <h1>Welcome to the Guidance System</h1>
      <p>Manage student records and offenses efficiently.</p>
      <div class="button-container">
      <button onClick={() => window.location.href = '/students'}>View Students</button>
      <button onClick={() => window.location.href = '/records'}>Manage Records</button>
      <button onClick={() => window.location.href = '/addreport'}>Add Report</button>
      <button onClick={() => window.location.href = '/editstudent'}>Manage Students</button>
      <button onClick={() => window.location.href = '/analytics'}>Analytics</button>
      </div>
    </div>
  );
};

export default Dashboard;