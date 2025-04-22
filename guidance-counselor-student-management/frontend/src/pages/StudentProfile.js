import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StudentProfile = () => {
  const { lrn } = useParams(); // Get the LRN from the URL
  const [student, setStudent] = useState(null); // State to store student details
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    // Fetch student details from the backend
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${lrn}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [lrn]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!student) {
    return <p>No student found with LRN: {lrn}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Student Profile</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ marginRight: '20px' }}>
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            style={{ borderRadius: '50%', width: '150px', height: '150px' }}
          />
        </div>
        <div>
          <p><strong>LRN:</strong> {student.lrn}</p>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Grade:</strong> {student.grade}</p>
          <p><strong>Section:</strong> {student.section}</p>
          <p><strong>Sex:</strong> {student.sex}</p>
          <p><strong>Birthdate:</strong> {student.birthdate}</p>
          <p><strong>Mother Tongue:</strong> {student.mother_tongue}</p>
          <p><strong>Religion:</strong> {student.religion}</p>
          <p><strong>Barangay:</strong> {student.barangay}</p>
          <p><strong>Municipality/City:</strong> {student.municipality_city}</p>
          <p><strong>Father's Name:</strong> {student.father_name}</p>
          <p><strong>Mother's Name:</strong> {student.mother_name}</p>
          <p><strong>Guardian's Name:</strong> {student.guardian_name}</p>
          <p><strong>Contact Number:</strong> {student.contact_number}</p>
          <p><strong>Date Registered:</strong> {student.date_time}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;