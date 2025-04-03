import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/styles.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedStudent, setHighlightedStudent] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHighlight = (student) => {
    setHighlightedStudent(student);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      axios.delete(`http://localhost:5000/api/students/${id}`)
        .then(() => {
          setStudents(students.filter(student => student.id !== id));
          setHighlightedStudent(null);
          alert('Student deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting student:', error);
          alert('Failed to delete student.');
        });
    }
  };

  const handleEdit = (id) => {
    // Redirect to the edit page for the selected student
    window.location.href = `/edit-student/${id}`;
  };

  return (
    <div>
      <h1>Student List</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
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
              key={student.id}
              onMouseEnter={() => handleHighlight(student)}
              onMouseLeave={() => setHighlightedStudent(null)}
              style={{
                backgroundColor: highlightedStudent?.id === student.id ? '#f0f8ff' : 'transparent',
              }}
            >
              <td>{student.name}</td>
              <td>{student.grade}</td>
              <td>{student.section}</td>
              <td>{student.gender}</td>
              <td>{student.birth}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {highlightedStudent && (
        <div style={{ marginTop: '20px' }}>
          <h3>Actions for {highlightedStudent.name}</h3>
          <button
            onClick={() => handleEdit(highlightedStudent.id)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#3498db',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(highlightedStudent.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#e74c3c',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentList;