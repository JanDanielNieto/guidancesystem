import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/ManageStudentsByGrade.css'; // Add styles for this page

const ManageStudentsByGrade = () => {
  const [students, setStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [showDeleteAll, setShowDeleteAll] = useState(false); // State to toggle "Delete All Data" button visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // State to track the selected student
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [gradeCounts, setGradeCounts] = useState({}); // State to store the count of students per grade

  useEffect(() => {
    // Fetch all students from the backend
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students'); // Use the correct backend URL
        const data = await response.json();
        setStudents(data);

        // Calculate the count of students for each grade
        const counts = data.reduce((acc, student) => {
          acc[student.grade] = (acc[student.grade] || 0) + 1;
          return acc;
        }, {});
        setGradeCounts(counts);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Filter students by the selected grade
  const filteredStudents = students.filter(student => student.grade === selectedGrade);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setFile(null); // Clear the file input
        // Optionally, refresh the student list
        const updatedStudents = await fetch('http://localhost:5000/api/students');
        const updatedData = await updatedStudents.json();
        setStudents(updatedData);

        // Recalculate the count of students for each grade
        const counts = updatedData.reduce((acc, student) => {
          acc[student.grade] = (acc[student.grade] || 0) + 1;
          return acc;
        }, {});
        setGradeCounts(counts);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

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
            {grade} ({gradeCounts[grade] || 0}) {/* Display the count */}
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <Link to="/add-student" className="add-button">Add Student</Link>
        <button className="edit-button" onClick={() => alert('Edit functionality not implemented yet.')}>Edit Student</button>
        {selectedStudent && (
          <button
            className="delete-button"
            onClick={() => alert('Delete functionality not implemented yet.')}
          >
            Delete Student
          </button>
        )}
        {showDeleteAll && (
          <button
            className="delete-all-button"
            onClick={() => alert('Delete All Data functionality not implemented yet.')}
          >
            Delete All Data
          </button>
        )}
        <div className="upload-container">
          <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
          <button className="upload-button" onClick={handleUpload}>
            Upload Data
          </button>
        </div>
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
              <tr key={student.id}>
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