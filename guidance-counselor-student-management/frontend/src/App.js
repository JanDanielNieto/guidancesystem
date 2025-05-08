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

// Utility function to check authentication
const isAuthenticated = () => {
  // Check if the user is authenticated (e.g., by checking a token in localStorage)
  return !!localStorage.getItem('authToken');
};

// Refactored ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation(); // Get the current route

  return (
    <>
      {/* Conditionally render the Navbar */}
      {location.pathname !== '/login' && <Navbar />}
      <div className="container">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <ManageStudentsByGrade />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:lrn"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <Records />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addreport"
            element={
              <ProtectedRoute>
                <AddReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editstudent"
            element={
              <ProtectedRoute>
                <EditStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-students-by-grade"
            element={
              <ProtectedRoute>
                <ManageStudentsByGrade />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sort-and-manage"
            element={
              <ProtectedRoute>
                <SortAndManageStudents />
              </ProtectedRoute>
            }
          />
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