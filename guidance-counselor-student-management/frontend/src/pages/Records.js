import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/styles.css';

const Records = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [editingCell, setEditingCell] = useState(null); // Track the currently edited cell
  const [showTutorial, setShowTutorial] = useState(false); // Track whether the tutorial is visible

  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      name: "John Doe",
      grade: "10",
      section: "A",
      offenses: [
        { type: "Bullying", reason: "Pushed a classmate", date: "2023-09-15 10:00 AM" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      grade: "11",
      section: "B",
      offenses: [
        { type: "Cheating", reason: "Copied during an exam", date: "2023-09-16 11:30 AM" },
      ],
    },
    {
      id: 3,
      name: "Jack Johnson",
      grade: "12",
      section: "C",
      offenses: [
        { type: "Vandalism", reason: "Drew on the wall", date: "2023-09-17 01:00 PM" },
      ],
    },
    {
      id: 4,
      name: "Jill Brown",
      grade: "9",
      section: "D",
      offenses: [
        { type: "Disrespect", reason: "Talked back to a teacher", date: "2023-09-18 02:15 PM" },
      ],
    },
  ];

  useEffect(() => {
    // Simulate fetching students from an API
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        // Use mock data if API fails
        setStudents(mockData);
      });
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter suggestions based on the input
    if (value) {
      const filteredSuggestions = mockData.filter((student) =>
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

  const handleOffenseChange = (studentId, offenseIndex, field, value) => {
    // Update the specific offense field of the student being edited
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? {
              ...student,
              offenses: student.offenses.map((offense, index) =>
                index === offenseIndex ? { ...offense, [field]: value } : offense
              ),
            }
          : student
      )
    );
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCellClick = (studentId, offenseIndex, field) => {
    setEditingCell({ studentId, offenseIndex, field }); // Set the cell being edited
  };

  const handleBlur = () => {
    setEditingCell(null); // Exit editing mode when the cell loses focus
  };

  const toggleTutorial = () => {
    setShowTutorial(!showTutorial); // Toggle the tutorial visibility
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h1>Student Offenses</h1>

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
          borderRadius: '20%',
          fontSize: '20px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        Help
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
            <li><strong>Edit:</strong> Click on a cell to edit the offense type or reason.</li>
            <li><strong>Save:</strong> Click outside the cell to save your changes.</li>
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
                key={student.id}
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
            <th>Name</th>
            <th>Grade</th>
            <th>Section</th>
            <th>Type of Offense</th>
            <th>Reason</th>
            <th>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student =>
            student.offenses.map((offense, index) => (
              <tr key={`${student.id}-${index}`}>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.section}</td>
                <td
                  onClick={() => handleCellClick(student.id, index, "type")}
                  style={{ cursor: 'pointer' }}
                >
                  {editingCell &&
                  editingCell.studentId === student.id &&
                  editingCell.offenseIndex === index &&
                  editingCell.field === "type" ? (
                    <input
                      type="text"
                      value={offense.type}
                      onChange={(e) =>
                        handleOffenseChange(student.id, index, "type", e.target.value)
                      }
                      onBlur={handleBlur}
                      style={{
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        width: '150px',
                      }}
                      autoFocus
                    />
                  ) : (
                    offense.type
                  )}
                </td>
                <td
                  onClick={() => handleCellClick(student.id, index, "reason")}
                  style={{ cursor: 'pointer' }}
                >
                  {editingCell &&
                  editingCell.studentId === student.id &&
                  editingCell.offenseIndex === index &&
                  editingCell.field === "reason" ? (
                    <input
                      type="text"
                      value={offense.reason}
                      onChange={(e) =>
                        handleOffenseChange(student.id, index, "reason", e.target.value)
                      }
                      onBlur={handleBlur}
                      style={{
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        width: '300px',
                      }}
                      autoFocus
                    />
                  ) : (
                    offense.reason
                  )}
                </td>
                <td>{offense.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Records;