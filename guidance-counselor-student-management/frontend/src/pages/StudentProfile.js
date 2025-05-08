import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/StudentProfile.css';
import config from '../config';

const StudentProfile = () => {
  const { lrn } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150'); // Default profile image
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/students/${lrn}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        setStudent(data);
        if (data.profile_image) {
          setProfileImage(data.profile_image); // Load profile image if available
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [lrn]);

  const handleEditClick = () => {
    setEditedStudent({ ...student });
    setIsEditPopupOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/students/${editedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedStudent),
      });

      if (response.ok) {
        alert('Student updated successfully.');
        setStudent(editedStudent);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Store the selected file in state
  };

  const handleProfilePictureUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profile_image', selectedFile);

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/students/${lrn}/upload-profile-picture`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.profile_image); // Update the profile image
        alert('Profile picture updated successfully.');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('An error occurred while uploading the profile picture.');
    }
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
    <div className="student-profile-container">
      <h1 className="student-profile-header">Student Profile</h1>
      <div className="profile-section">
        <div className="profile-details">
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
          <button onClick={handleEditClick} className="edit-button">
            Edit
          </button>
        </div>
      </div>

      <h2>Offense Record History</h2>
      {student.offenses && student.offenses.length > 0 ? (
        <table className="offense-table">
          <thead>
            <tr>
              <th>Type of Offense</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {student.offenses.map((offense, index) => (
              <tr key={index}>
                <td>{offense.type}</td>
                <td>{offense.reason}</td>
                <td>{offense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No offenses recorded for this student.</p>
      )}

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