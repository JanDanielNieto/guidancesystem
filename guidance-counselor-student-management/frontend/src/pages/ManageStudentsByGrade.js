import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/ManageStudentsByGrade.css'; // Add styles for this page

const ManageStudentsByGrade = () => {
  const [students, setStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [showDeleteAll, setShowDeleteAll] = useState(false); // State to toggle "Delete All Data" button visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // State to track the selected student

  useEffect(() => {
    // Fetch all students from the backend
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students'); // Replace with your actual API endpoint
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Filter students by the selected grade
  const filteredStudents = students.filter(student => student.grade === selectedGrade);

  // Handle delete all data
  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all student data?')) {
      try {
        const response = await fetch('/api/delete_all_students', { method: 'DELETE' });
        if (response.ok) {
          setStudents([]);
          alert('All student data has been deleted.');
        } else {
          alert('Failed to delete all data.');
        }
      } catch (error) {
        console.error('Error deleting all data:', error);
      }
    }
  };

  // Handle delete individual student
  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setStudents(students.filter(student => student.id !== id));
          alert('Student deleted successfully.');
        } else {
          alert('Failed to delete student.');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  // Handle edit student
  const handleEditStudent = () => {
    if (selectedStudent) {
      alert(`Editing student: ${selectedStudent.name}`);
      // Navigate to the edit page or open a modal for editing
    } else {
      alert('Please select a student to edit.');
    }
  };

  // Add shortcut key for "Delete All Data"
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'd') {
        setShowDeleteAll(true); // Show the "Delete All Data" button
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="manage-students-container">
    <header className="manage-students-header">
      <h1>Manage Students by Grade</h1>
    </header>
    <div className="grade-buttons">
      {['Grade 10', 'Grade 9', 'Grade 8', 'Grade 7'].map(grade => (
        <button
          key={grade}
          className={`grade-button ${selectedGrade === grade ? 'active' : ''}`}
          onClick={() => setSelectedGrade(grade)}
        >
          {grade}
        </button>
      ))}
    </div>
      <div className="action-buttons">
        <Link to="/add-student" className="add-button">Add Student</Link>
        <button className="edit-button" onClick={handleEditStudent}>Edit Student</button>
        {selectedStudent && (
          <button
            className="delete-button"
            onClick={() => handleDeleteStudent(selectedStudent.id)}
          >
            Delete Student
          </button>
        )}
        {showDeleteAll && (
          <button
            className="delete-all-button"
            onClick={handleDeleteAll}
            title="Shortcut: Ctrl + D"
          >
            Delete All Data
          </button>
        )}
      </div>
      <div className="students-table-container">
        <h2>{selectedGrade}</h2>
        <table className="students-table">
          <thead>
            <tr>
              <th>LRN</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Section</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr
                key={student.id}
                className={selectedStudent?.id === student.id ? 'selected-row' : ''}
                onClick={() => setSelectedStudent(student)} // Highlight the row on click
              >
                <td>{student.lrn}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudentsByGrade;