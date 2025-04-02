import React from 'react';
import '../css/styles.css';

const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to the Guidance System</h1>
      <p>Manage student records and offenses efficiently.</p>
      <button onClick={() => window.location.href = '/students'}>View Students</button>
    </div>
  );
};

export default Dashboard;