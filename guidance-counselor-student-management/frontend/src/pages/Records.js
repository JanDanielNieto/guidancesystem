import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/styles.css';
import config from '../config';

const Records = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedOffense, setSelectedOffense] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editedOffense, setEditedOffense] = useState(null);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false); // State to toggle the add popup
  const [newOffense, setNewOffense] = useState({
    studentId: '',
    type: '',
    reason: '',
  });
  const [searchStudentTerm, setSearchStudentTerm] = useState(''); // For searching students
  const [searchedStudents, setSearchedStudents] = useState([]); // Filtered students for the search
  const [selectedStudentName, setSelectedStudentName] = useState(''); // To display the selected student's name

  // Fetch all students and their offenses
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/students`);
        setStudents(response.data);
        setFilteredStudents(response.data); // Initialize filteredStudents with all students
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  // Handle edit button click
  const handleEditOffense = (offense) => {
    setSelectedOffense(offense);
    setEditedOffense({ ...offense });
    setIsEditPopupOpen(true);
  };

  const offenseTypeLabels = {
    Bullying: "Light Offense",
    Cheating: "Less Serious or Less Grave Offense",
    Vandalism: "Serious or Grave Offense",
  };
  

  // Handle delete button click
  const handleDeleteOffense = async (offense) => {
    if (!window.confirm('Are you sure you want to delete this offense?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${config.API_BASE_URL}/api/offenses/${offense.id}`
      );

      if (response.status === 200) {
        alert('Offense deleted successfully.');
        // Refetch the updated list of students
        const updatedStudents = await axios.get(`${config.API_BASE_URL}/api/students`);
        setStudents(updatedStudents.data);
        setFilteredStudents(updatedStudents.data); // Update filteredStudents as well
      } else {
        alert(`Failed to delete offense: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error deleting offense:', error);
      alert('An error occurred while deleting the offense.');
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewOffense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchStudent = () => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchStudentTerm.toLowerCase())
    );
    setSearchedStudents(filtered);
  };

  const handleSelectStudent = (student) => {
    setNewOffense((prev) => ({ ...prev, studentId: student.id }));
    setSelectedStudentName(`${student.name} - ${student.grade} ${student.section}`);
    setSearchedStudents([]); // Hide the suggestions
  };

  const handleSaveAdd = async () => {
    if (!newOffense.studentId || !newOffense.type) {
      alert('Please select a student and specify the type of offense.');
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/offenses`, newOffense);

      if (response.status === 201) {
        alert('Offense added successfully.');
        const updatedStudents = await axios.get(`${config.API_BASE_URL}/api/students`);
        setStudents(updatedStudents.data);
        setFilteredStudents(updatedStudents.data);
        setIsAddPopupOpen(false); // Close the popup
        setNewOffense({ studentId: '', type: '', reason: '' }); // Reset the form
        setSelectedStudentName(''); // Reset the selected student name
      } else {
        alert('Failed to add offense.');
      }
    } catch (error) {
      console.error('Error adding offense:', error);
      alert('An error occurred while adding the offense.');
    }
  };

  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
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
        `${config.API_BASE_URL}/api/offenses/${editedOffense.id}`,
        {
          type: editedOffense.type, // Ensure this matches the backend field
          reason: editedOffense.reason,
          date: editedOffense.date,
        }
      );
  
      if (response.status === 200) {
        alert('Offense updated successfully.');
        const updatedStudents = await axios.get(`${config.API_BASE_URL}/api/students`);
        setStudents(updatedStudents.data);
        setFilteredStudents(updatedStudents.data);
        setIsEditPopupOpen(false);
      } else {
        alert('Failed to update offense.');
      }
    } catch (error) {
      console.error('Error updating offense:', error);
      alert('An error occurred while updating the offense.');
    }
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h1>Student Offenses</h1>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <button className="button" onClick={handleSearch}>
          Search
        </button>
        <button className="button" onClick={() => setIsAddPopupOpen(true)}>
          Add Record
        </button>
      </div>

     {/* Add Record Popup */}
{isAddPopupOpen && (
  <div className="popup-overlay">
    <div className="popup-large">
      <h2>Add Record</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission behavior
          handleSearchStudent(); // Trigger the search action
        }}
      >
        <label>
          Search Student:
          <input
            type="text"
            placeholder="Search by name"
            value={searchStudentTerm}
            onChange={(e) => setSearchStudentTerm(e.target.value)}
          />
          <button type="button" onClick={handleSearchStudent}>
            Search
          </button>
        </label>
        <div>
          {selectedStudentName ? (
            <p><strong>Selected Student:</strong> {selectedStudentName}</p>
          ) : (
            <ul>
              {searchedStudents.map((student) => (
                <li
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: newOffense.studentId === student.id ? '#ddd' : 'transparent',
                  }}
                >
                  {student.name} - {student.grade} {student.section}
                </li>
              ))}
            </ul>
          )}
        </div>
        <label>
          Type of Offense:
          <select
            name="type"
            value={newOffense.type}
            onChange={handleAddChange}
          >
            <option value="">Select Offense Type</option>
            <option value="Bullying">Light Offense</option>
            <option value="Cheating">Less Serious or Less Grave Offense</option>
            <option value="Vandalism">Serious or Grave Offense</option>
          </select>
        </label>
        <label>
          Reason (Optional):
          <textarea
            name="reason"
            value={newOffense.reason}
            onChange={handleAddChange}
            rows="4"
            placeholder="Enter the reason for the offense (optional)"
          />
        </label>
        <div className="popup-buttons">
          <button type="button" onClick={handleSaveAdd}>Save</button>
          <button type="button" onClick={handleCloseAddPopup}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}

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
              <td>{offenseTypeLabels[offense.type] || offense.type}</td> {/* Map raw value to label */}
              <td>{offense.reason}</td>
              <td>{offense.date}</td>
              <td>
                <button onClick={() => handleEditOffense(offense)}>Edit</button>
                <button onClick={() => handleDeleteOffense(offense)}>Delete</button>
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
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setIsEditPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;