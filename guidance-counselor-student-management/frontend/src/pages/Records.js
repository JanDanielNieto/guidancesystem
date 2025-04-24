import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/styles.css';

const Records = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffense, setSelectedOffense] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editedOffense, setEditedOffense] = useState(null);

  // Fetch all students and their offenses
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Handle edit button click
  const handleEditOffense = (offense) => {
    setSelectedOffense(offense);
    setEditedOffense({ ...offense });
    setIsEditPopupOpen(true);
  };

  // Handle delete button click
  const handleDeleteOffense = async (offense) => {
    if (!window.confirm('Are you sure you want to delete this offense?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/offenses/${offense.id}`
      );

      if (response.status === 200) {
        alert('Offense deleted successfully.');
        // Update the state to remove the deleted offense
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === offense.student_id
              ? {
                  ...student,
                  offenses: student.offenses.filter(
                    (o) => o.id !== offense.id
                  ),
                }
              : student
          )
        );
      } else {
        alert(`Failed to delete offense: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error deleting offense:', error);
      alert('An error occurred while deleting the offense.');
    }
  };

  // Handle changes in the edit popup fields
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedOffense((prev) => ({ ...prev, [name]: value }));
  };

  // Save the edited offense
  const handleSaveEdit = async () => {
    if (!editedOffense || !editedOffense.id) {
      alert('No offense selected for editing.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/offenses/${editedOffense.id}`,
        editedOffense
      );

      if (response.status === 200) {
        alert('Offense updated successfully.');
        // Update the state to reflect the edited offense
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === selectedOffense.student_id
              ? {
                  ...student,
                  offenses: student.offenses.map((offense) =>
                    offense.id === editedOffense.id ? editedOffense : offense
                  ),
                }
              : student
          )
        );
        setIsEditPopupOpen(false);
      } else {
        alert('Failed to update offense.');
      }
    } catch (error) {
      console.error('Error updating offense:', error);
      alert('An error occurred while updating the offense.');
    }
  };

  // Filter students by search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h1>Student Offenses</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            <th>Name</th>
            <th>Grade</th>
            <th>Section</th>
            <th>Type of Offense</th>
            <th>Reason</th>
            <th>Date and Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) =>
            student.offenses.map((offense) => (
              <tr key={`${student.id}-${offense.id}`}>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.section}</td>
                <td>{offense.type}</td>
                <td>{offense.reason}</td>
                <td>{offense.date}</td>
                <td>
                  <button
                    onClick={() => handleEditOffense(offense)}
                    style={{
                      marginRight: '5px',
                      padding: '5px 10px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOffense(offense)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Offense Popup */}
      {isEditPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-large">
            <h2>Edit Offense</h2>
            <form>
              <label>
                Type of Offense:
                <input
                  type="text"
                  name="type"
                  value={editedOffense?.type || ''}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Reason:
                <input
                  type="text"
                  name="reason"
                  value={editedOffense?.reason || ''}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Date and Time:
                <input
                  type="datetime-local"
                  name="date"
                  value={editedOffense?.date || ''}
                  onChange={handleEditChange}
                />
              </label>
            </form>
            <div className="popup-buttons">
              <button
                onClick={handleSaveEdit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditPopupOpen(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;