import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/styles.css';

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/students/${id}`)
      .then(response => {
        setStudent(response.data);
      })
      .catch(error => {
        console.error('Error fetching student profile:', error);
      });
  }, [id]);

  if (!student) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{student.name}'s Profile</h1>
      <p><strong>Grade:</strong> {student.grade}</p>
      <p><strong>Section:</strong> {student.section}</p>
      <p><strong>Gender:</strong> {student.gender}</p>
      <p><strong>Birthdate:</strong> {student.birthdate}</p>
      <p><strong>Address:</strong> {student.address ? `${student.address.house_no}, ${student.address.barangay}, ${student.address.city}, ${student.address.province}` : 'N/A'}</p>
      <p><strong>Father's Name:</strong> {student.father_name}</p>
      <p><strong>Mother's Name:</strong> {student.mother_name}</p>
      <p><strong>Guardian's Name:</strong> {student.guardian_name}</p>
    </div>
  );
};

export default StudentProfile;