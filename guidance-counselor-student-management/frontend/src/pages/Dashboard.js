import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../css/styles.css';

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isTutorialOpen, setIsTutorialOpen] = useState(false); // State to manage tutorial visibility
  const [currentPage, setCurrentPage] = useState(0); // State to track the current tutorial page

  const tutorialPages = [
    {
      title: 'Welcome to the Guidance System',
      content: 'This application helps you manage student records and offenses efficiently.',
    },
    {
      title: 'Manage Students',
      content: 'Use the "Manage Students" section to view, edit, and delete student information by grade.',
    },
    {
      title: 'Manage Records',
      content: 'The "Manage Records" section allows you to view and manage student offense records.',
    },
    {
      title: 'Add Report',
      content: 'In the "Add Report" section, you can add new offense records for students.',
    },
    {
      title: 'Analytics',
      content: 'The "Analytics" section provides insights into student offenses by type and grade.',
    },
  ];

  const closeTutorial = () => {
    setIsTutorialOpen(false);
    setCurrentPage(0);
  };

  const nextPage = () => {
    if (currentPage < tutorialPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
          <button className="tutorial-button" onClick={() => setIsTutorialOpen(true)}>?</button>
        </div>
      </div>

      {isTutorialOpen && (
        <div className="tutorial-popup">
          <div className="tutorial-content">
            <h2>{tutorialPages[currentPage].title}</h2>
            <p>{tutorialPages[currentPage].content}</p>
            <div className="tutorial-navigation">
              <button onClick={prevPage} disabled={currentPage === 0}>
                Previous
              </button>
              <button onClick={nextPage} disabled={currentPage === tutorialPages.length - 1}>
                Next
              </button>
            </div>
            <button className="close-tutorial" onClick={closeTutorial}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Dashboard;