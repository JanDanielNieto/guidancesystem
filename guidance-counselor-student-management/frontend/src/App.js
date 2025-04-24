import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import StudentList from './components/StudentList';
import StudentProfile from './pages/StudentProfile';
import Records from './pages/Records';
import AddReport from './pages/AddReport';
import EditStudent from './pages/EditStudent';
import Analytics from './pages/Analytics';
import ManageStudentsByGrade from './pages/ManageStudentsByGrade';
import AddStudent from './pages/AddStudent';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<ManageStudentsByGrade />} /> {/* Updated route */}
          <Route path="/students/:lrn" element={<StudentProfile />} />
          <Route path="/records" element={<Records />} />
          <Route path="/addreport" element={<AddReport />} />
          <Route path="/editstudent" element={<EditStudent />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/manage-students-by-grade" element={<ManageStudentsByGrade />} />
          <Route path="/add-student" element={<AddStudent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;