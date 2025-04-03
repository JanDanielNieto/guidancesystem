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
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Mock data for demonstration
  const mockData = {
    "John Doe": { lrn: "123456789", grade: "10", section: "A", gender: "Male", birth: "2005-01-01" },
    "Jane Smith": { lrn: "987654321", grade: "11", section: "B", gender: "Female", birth: "2004-05-15" },
    "Jack Johnson": { lrn: "456789123", grade: "12", section: "C", gender: "Male", birth: "2003-09-20" },
    "Jill Brown": { lrn: "789123456", grade: "9", section: "D", gender: "Female", birth: "2006-03-10" },
  };

  useEffect(() => {
    // Simulate fetching students from an API
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        // Use mock data if API fails
        setStudents(Object.keys(mockData).map(name => ({ name, ...mockData[name] })));
      });
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter suggestions based on the input
    if (value) {
      const filteredSuggestions = Object.keys(mockData).filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
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
    navigate(`/students/:id${student.lrn}`);
  };

  const handleProfileClick = () => {
    if (selectedStudent) {
      navigate(`/students/:id${selectedStudent.lrn}`);
    }
  };

  const openPopup = () => setIsPopupOpen(true); // Open the popup
  const closePopup = () => setIsPopupOpen(false); // Close the popup

  const toggleTutorial = () => {
    setShowTutorial(!showTutorial); // Toggle the tutorial visibility
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
            {suggestions.map((name) => (
              <li
                key={name}
                onClick={() => handleSuggestionClick(name)}
                style={{
                  padding: '5px',
                  cursor: 'pointer',
                }}
              >
                {name}
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
          onClick={() => alert(`Edit ${selectedStudent?.name}`)}
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
          onClick={() => alert(`Delete ${selectedStudent?.name}`)}
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

      {/* Popup Component */}
      <Popup isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
};

export default StudentList;