import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import StudentProfile from './pages/StudentProfile';
import Records from './pages/Records';
import AddReport from './pages/AddReport';
import EditStudent from './pages/EditStudent';
import Analytics from './pages/Analytics';
import ManageStudentsByGrade from './pages/ManageStudentsByGrade';
import SortAndManageStudents from './pages/SortAndManageStudents'; // Import the component


const isAuthenticated = () => {
  // Check if the user is authenticated (e.g., by checking a token in localStorage)
  return !!localStorage.getItem('authToken');
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation(); // Get the current route

  return (
    <>
      {/* Conditionally render the Navbar */}
      {location.pathname !== '/login' && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/students" element={<ProtectedRoute element={<ManageStudentsByGrade />} />} />
          <Route path="/students/:lrn" element={<ProtectedRoute element={<StudentProfile />} />} />
          <Route path="/records" element={<ProtectedRoute element={<Records />} />} />
          <Route path="/addreport" element={<ProtectedRoute element={<AddReport />} />} />
          <Route path="/editstudent" element={<ProtectedRoute element={<EditStudent />} />} />
          <Route path="/analytics" element={<ProtectedRoute element={<Analytics />} />} />
          <Route path="/manage-students-by-grade" element={<ProtectedRoute element={<ManageStudentsByGrade />} />} />
          <Route path="/sort-and-manage" element={<ProtectedRoute element={<SortAndManageStudents />} />} /> {/* Add the route */}
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;