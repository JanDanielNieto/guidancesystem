import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import Popup from '../pages/Popup'; // Import the Popup component
import '../css/styles.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  const [showTutorial, setShowTutorial] = useState(false); // State to manage tutorial visibility
  const [showDeleteAllButton, setShowDeleteAllButton] = useState(false); // State to toggle visibility of the delete all button
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Fetch students from the backend API
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });

    // Add event listener for shortcut keys
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDeleteAllButton(true); // Show the delete all button
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter suggestions based on the input
    if (value) {
      const filteredSuggestions = students.filter((student) =>
        student.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name); // Set the selected name in the search bar
    setSuggestions([]); // Clear the suggestions
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student); // Set the selected student
  };

  const handleRowDoubleClick = (student) => {
    // Navigate to the StudentProfile page for the double-clicked student
    navigate(`/students/${student.lrn}`);
  };

  const handleProfileClick = () => {
    if (selectedStudent) {
      navigate(`/students/${selectedStudent.lrn}`);
    }
  };

  const openPopup = () => setIsPopupOpen(true); // Open the popup
  const closePopup = () => setIsPopupOpen(false); // Close the popup

  const toggleTutorial = () => {
    setShowTutorial(!showTutorial); // Toggle the tutorial visibility
  };

  const handleEdit = () => {
    if (!selectedStudent) {
      alert('Please select a student to edit.');
      return;
    }

    // Navigate to the EditStudent page with the selected student's ID
    navigate(`/edit-student/${selectedStudent.lrn}`);
  };

  const handleDelete = () => {
    if (!selectedStudent) {
      alert('Please select a student to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedStudent.name}?`)) {
      axios.delete(`http://localhost:5000/api/students/${selectedStudent.lrn}`)
        .then(response => {
          alert('Student deleted successfully!');
          // Remove the deleted student from the list
          setStudents(prevStudents => prevStudents.filter(student => student.lrn !== selectedStudent.lrn));
          setSelectedStudent(null); // Clear the selected student
        })
        .catch(error => {
          console.error('Error deleting student:', error);
          alert('Failed to delete student.');
        });
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all student records? This action cannot be undone.')) {
      axios.delete('http://localhost:5000/api/delete_all_students')
        .then(response => {
          alert('All student records deleted successfully!');
          setStudents([]); // Clear the student list
        })
        .catch(error => {
          console.error('Error deleting all students:', error);
          alert('Failed to delete all student records.');
        });
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', padding: '20px' }}>
      <h1>Student List</h1>

      {/* Tutorial Button */}
      <button
        onClick={toggleTutorial}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        ?
      </button>

      {/* Tutorial Popups */}
      {showTutorial && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '20px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            width: '300px',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h3>Tutorial</h3>
          <ul>
            <li><strong>Search:</strong> Use the search bar to filter students by name.</li>
            <li><strong>Edit:</strong> Select a student and click "Edit" to modify their details.</li>
            <li><strong>Delete:</strong> Select a student and click "Delete" to remove them.</li>
            <li><strong>Profile:</strong> Double-click a student or click "Profile" to view their profile.</li>
            <li><strong>Upload:</strong> Click "Upload" to open the file upload popup.</li>
          </ul>
          <button
            onClick={toggleTutorial}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleInputChange}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />

        {/* Dropdown for suggestions */}
        {suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '40px',
              left: '0',
              width: '300px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: 'white',
              listStyleType: 'none',
              padding: '10px',
              margin: '0',
              zIndex: 1000,
            }}
          >
            {suggestions.map((student) => (
              <li
                key={student.lrn}
                onClick={() => handleSuggestionClick(student.name)}
                style={{
                  padding: '5px',
                  cursor: 'pointer',
                }}
              >
                {student.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>LRN</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Section</th>
            <th>Gender</th>
            <th>Birthdate</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr
              key={student.lrn}
              onClick={() => handleRowClick(student)}
              onDoubleClick={() => handleRowDoubleClick(student)} // Handle double-click
              style={{
                backgroundColor: selectedStudent?.lrn === student.lrn ? '#f0f8ff' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <td>{student.lrn}</td>
              <td>{student.name}</td>
              <td>{student.grade}</td>
              <td>{student.section}</td>
              <td>{student.gender}</td>
              <td>{student.birth}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <h3>Actions</h3>
        <button
          onClick={handleEdit}
          disabled={!selectedStudent}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: selectedStudent ? '#3498db' : '#ccc',
            color: 'white',
            cursor: selectedStudent ? 'pointer' : 'not-allowed',
          }}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={!selectedStudent}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: selectedStudent ? '#e74c3c' : '#ccc',
            color: 'white',
            cursor: selectedStudent ? 'pointer' : 'not-allowed',
          }}
        >
          Delete
        </button>
        <button
          onClick={handleProfileClick} // Navigate to profile page
          disabled={!selectedStudent}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: selectedStudent ? '#2ecc71' : '#ccc',
            color: 'white',
            cursor: selectedStudent ? 'pointer' : 'not-allowed',
          }}
        >
          Profile
        </button>
        <button
          onClick={openPopup} // Open the popup
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#f39c12',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Upload
        </button>
      </div>

      {/* Hidden Delete All Data Button */}
      {showDeleteAllButton && (
        <button
          onClick={handleDeleteAll}
          style={{
            padding: '10px 20px',
            marginTop: '20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#e74c3c',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Delete All Data
        </button>
      )}

      {/* Popup Component */}
      <Popup isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
};

export default StudentList;