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

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/records" element={<Records />} />
          <Route path="/addreport" element={<AddReport />} />
          <Route path="/editstudent" element={<EditStudent />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;