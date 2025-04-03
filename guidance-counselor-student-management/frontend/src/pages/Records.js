import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/styles.css';

const Records = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  return (
    <div>
      <h1>Student Offenses</h1>
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
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.grade}</td>
              <td>{student.typeoffense}</td>
              <td>{student.reason}</td>
              <td>{student.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Records;