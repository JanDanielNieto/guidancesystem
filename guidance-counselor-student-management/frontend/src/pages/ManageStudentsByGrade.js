import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/ManageStudentsByGrade.css'; // Add styles for this page

const ManageStudentsByGrade = () => {
  const [students, setStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');

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
      <div className="students-table-container">
        <h2>{selectedGrade}</h2>
        <table className="students-table">
          <thead>
            <tr>
              <th>LRN</th>
              <th>Name</th>
              <th>Section</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.lrn}</td>
                <td>{student.name}</td>
                <td>{student.section}</td>
                <td>
                  <Link to={`/edit-student/${student.id}`} className="edit-button">Edit</Link>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudentsByGrade;