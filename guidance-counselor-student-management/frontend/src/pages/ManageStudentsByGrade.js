import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ManageStudentsByGrade.css'; // Add styles for this page

const ManageStudentsByGrade = () => {
  const [students, setStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [showDeleteAll, setShowDeleteAll] = useState(false); // State to toggle "Delete All Data" button visibility
  const [selectedStudent, setSelectedStudent] = useState(null); // State to track the selected student
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [gradeCounts, setGradeCounts] = useState({}); // State to store the count of students per grade
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate(); // For navigation to the profile page

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

  // Add keybind logic for Ctrl + Shift + D
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        setShowDeleteAll((prev) => !prev); // Toggle the visibility of the "Delete All Data" button
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter students by the selected grade and search query
  const filteredStudents = students.filter(
    (student) =>
      student.grade === selectedGrade &&
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Handle delete student
  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Student deleted successfully.');
        setStudents(students.filter((student) => student.id !== id));
        setSelectedStudent(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('An error occurred while deleting the student.');
    }
  };

  // Handle delete all students
  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/delete_all_students', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('All students deleted successfully.');
        setStudents([]);
        setGradeCounts({});
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting all students:', error);
      alert('An error occurred while deleting all students.');
    }
  };

  // Navigate to the profile page
  const handleViewProfile = () => {
    if (selectedStudent) {
      navigate(`/students/${selectedStudent.lrn}`);
    } else {
      alert('Please select a student to view their profile.');
    }
  };

  // Handle double-click on a student row
  const handleRowDoubleClick = (student) => {
    navigate(`/students/${student.lrn}`);
  };

  return (
    <div className="manage-students-container">
      <header className="manage-students-header">
        <h1>Manage Students by Grade</h1>
      </header>
      <div className="grade-buttons">
        {['Grade 10', 'Grade 9', 'Grade 8', 'Grade 7'].map((grade) => (
          <button
            key={grade}
            className={`grade-button ${selectedGrade === grade ? 'active' : ''}`}
            onClick={() => setSelectedGrade(grade)}
          >
            {grade} ({gradeCounts[grade] || 0}) {/* Display the count */}
          </button>
        ))}
      </div>
      <div className="buttons">
        <Link to="/add-student" className="button">
          Add Student
        </Link>
        <button
          className="button"
          onClick={() =>
            selectedStudent
              ? alert(`Editing student: ${selectedStudent.name}`)
              : alert('Please select a student to edit.')
          }
        >
          Edit Student
        </button>
        <button
          className="button"
          onClick={() =>
            selectedStudent
              ? handleDeleteStudent(selectedStudent.id)
              : alert('Please select a student to delete.')
          }
        >
          Delete Student
        </button>
        <button
          className="button"
          onClick={handleViewProfile}
          disabled={!selectedStudent}
        >
          View Profile
        </button>
        {showDeleteAll && (
          <button className="button delete-all-button" onClick={handleDeleteAll}>
            Delete All Data
          </button>
        )}
        <div className="upload-container">
          <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
          <button className="uploadbutton" onClick={handleUpload}>
            Upload Data
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="button" onClick={() => alert(`Searching for: ${searchQuery}`)}>
            Search
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
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                onDoubleClick={() => handleRowDoubleClick(student)} // Double-click event
                className={selectedStudent?.id === student.id ? 'selected' : ''}
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