import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StudentProfile = () => {
  const { lrn } = useParams(); // Get the LRN from the URL
  const [student, setStudent] = useState(null); // State to store student details
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State to toggle the edit popup
  const [editedStudent, setEditedStudent] = useState(null); // State to store the edited student

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

  const handleEditClick = () => {
    setEditedStudent({ ...student }); // Populate the form with the current student's data
    setIsEditPopupOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${editedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedStudent),
      });

      if (response.ok) {
        alert('Student updated successfully.');
        setStudent(editedStudent); // Update the student state with the edited data
        setIsEditPopupOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('An error occurred while updating the student.');
    }
  };

  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
  };

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
          <button onClick={handleEditClick} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Edit
          </button>
        </div>
      </div>

      {/* Offense Record History */}
      <h2>Offense Record History</h2>
      {student.offenses && student.offenses.length > 0 ? (
  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
    <thead>
      <tr>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type of Offense</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Reason</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
      </tr>
    </thead>
    <tbody>
      {student.offenses.map((offense, index) => (
        <tr key={index}>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{offense.type}</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{offense.reason}</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{offense.date}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No offenses recorded for this student.</p>
)}

      {/* Edit Student Popup */}
      {isEditPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-large">
            <h2>Edit Student</h2>
            <form>
              <label>
                LRN (Read-Only):
                <input
                  type="text"
                  name="lrn"
                  value={editedStudent.lrn}
                  readOnly
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editedStudent.name}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Grade:
                <input
                  type="text"
                  name="grade"
                  value={editedStudent.grade}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Section:
                <input
                  type="text"
                  name="section"
                  value={editedStudent.section}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Sex:
                <select
                  name="sex"
                  value={editedStudent.sex}
                  onChange={handleEditChange}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </label>
              <label>
                Birthdate:
                <input
                  type="date"
                  name="birthdate"
                  value={editedStudent.birthdate}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Mother Tongue:
                <input
                  type="text"
                  name="mother_tongue"
                  value={editedStudent.mother_tongue}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Religion:
                <input
                  type="text"
                  name="religion"
                  value={editedStudent.religion}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Barangay:
                <input
                  type="text"
                  name="barangay"
                  value={editedStudent.barangay}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Municipality/City:
                <input
                  type="text"
                  name="municipality_city"
                  value={editedStudent.municipality_city}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Father's Name:
                <input
                  type="text"
                  name="father_name"
                  value={editedStudent.father_name}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Mother's Name:
                <input
                  type="text"
                  name="mother_name"
                  value={editedStudent.mother_name}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Guardian's Name:
                <input
                  type="text"
                  name="guardian_name"
                  value={editedStudent.guardian_name}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Contact Number:
                <input
                  type="text"
                  name="contact_number"
                  value={editedStudent.contact_number}
                  onChange={handleEditChange}
                />
              </label>
            </form>
            <div className="popup-buttons">
              <button className="button" onClick={handleSaveEdit}>
                Save
              </button>
              <button className="button" onClick={handleCloseEditPopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;