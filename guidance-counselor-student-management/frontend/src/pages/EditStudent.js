import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/styles.css';
import config from '../config'; // Import the centralized config file

const EditStudent = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch the list of students from the API
    axios.get(`${config.API_BASE_URL}/api/students`)
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleInputChange = (id, field, value) => {
    // Update the specific field of the student being edited
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  const handleSave = (id) => {
    // Save the updated student information to the server
    const updatedStudent = students.find(student => student.id === id);
    axios.put(`${config.API_BASE_URL}/api/students/${id}`, updatedStudent)
      .then(response => {
        alert('Student information updated successfully!');
      })
      .catch(error => {
        console.error('Error updating student:', error);
        alert('Failed to update student information.');
      });
  };

  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Edit Student Profiles</h1>
      {students.map(student => (
        <div
          key={student.id}
          style={{
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
          }}
        >
          <label>
            <strong>Name:</strong>
            <input
              type="text"
              value={student.name}
              onChange={(e) => handleInputChange(student.id, 'name', e.target.value)}
              style={{
                marginLeft: '10px',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                width: '300px',
              }}
            />
          </label>
          <br />
          <label>
            <strong>Grade:</strong>
            <input
              type="text"
              value={student.grade}
              onChange={(e) => handleInputChange(student.id, 'grade', e.target.value)}
              style={{
                marginLeft: '10px',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                width: '300px',
              }}
            />
          </label>
          <br />
          <label>
            <strong>Section:</strong>
            <input
              type="text"
              value={student.section}
              onChange={(e) => handleInputChange(student.id, 'section', e.target.value)}
              style={{
                marginLeft: '10px',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '3px',
                width: '300px',
              }}
            />
          </label>
          <br />
          <button
            onClick={() => handleSave(student.id)}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditStudent;