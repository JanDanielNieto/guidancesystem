import React, { useState, useEffect } from 'react';
import '../css/SortAndManageStudents.css'; // Add styles for this page

const SortAndManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]); // State for multi-selection
  const [bulkEditData, setBulkEditData] = useState({ grade: '', section: '' }); // State for bulk edit
  const [isBulkEditPopupOpen, setIsBulkEditPopupOpen] = useState(false); // State to toggle bulk edit popup

  useEffect(() => {
    // Fetch all students from the backend
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students');
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleGradeSelection = (grade) => {
    setSelectedGrade(grade);
    setFilteredStudents(
      students.filter((student) => student.grade === grade && (selectedSection ? student.section === selectedSection : true))
    );
    setSelectedStudents([]); // Clear selected students when grade changes
  };

  const handleSectionSelection = (section) => {
    setSelectedSection(section);
    setFilteredStudents(
      students.filter((student) => student.section === section && (selectedGrade ? student.grade === selectedGrade : true))
    );
    setSelectedStudents([]); // Clear selected students when section changes
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId) // Deselect if already selected
        : [...prevSelected, studentId] // Add to selection
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student to delete.');
      return;
    }
  
    if (!window.confirm('Are you sure you want to delete the selected students?')) {
      return;
    }
  
    try {
      for (const studentId of selectedStudents) {
        // Use the new route for deleting students
        await fetch(`http://localhost:5000/api/sort-and-manage/students/${studentId}`, {
          method: 'DELETE',
        });
      }
  
      alert('Selected students deleted successfully.');
  
      // Update the frontend state
      setStudents((prevStudents) =>
        prevStudents.filter((student) => !selectedStudents.includes(student.id))
      );
      setFilteredStudents((prevFiltered) =>
        prevFiltered.filter((student) => !selectedStudents.includes(student.id))
      );
      setSelectedStudents([]); // Clear selection
    } catch (error) {
      console.error('Error deleting students:', error);
      alert('An error occurred while deleting the selected students.');
    }
  };

  const handleBulkEditChange = (e) => {
    const { name, value } = e.target;
    setBulkEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulkEditSave = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student to edit.');
      return;
    }
  
    try {
        for (const studentId of selectedStudents) {
            const response = await fetch(`http://localhost:5000/api/sort-and-manage/students/${studentId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(bulkEditData), // Ensure this contains the correct data
            });
          
            if (!response.ok) {
              const errorData = await response.json();
              console.error(`Error updating student ID ${studentId}:`, errorData); // Debugging log
              throw new Error(`Failed to update student ID ${studentId}`);
            }
          }
  
      // Update the frontend state
      const updatedStudents = students.map((student) =>
        selectedStudents.includes(student.id)
          ? { ...student, ...bulkEditData }
          : student
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setSelectedStudents([]); // Clear selection
      setBulkEditData({ grade: '', section: '' }); // Reset bulk edit data
      setIsBulkEditPopupOpen(false); // Close the popup
    } catch (error) {
      console.error('Error updating students:', error);
      alert('An error occurred while updating the selected students.');
    }
  };

  return (
    <div className="sort-and-manage-container">
      <header className="sort-and-manage-header">
        <h1>Sort and Manage Students</h1>
      </header>
      <div className="filters">
        <select onChange={(e) => handleGradeSelection(e.target.value)} value={selectedGrade}>
          <option value="">Select Grade</option>
          {[...new Set(students.map((student) => student.grade))].map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        <select onChange={(e) => handleSectionSelection(e.target.value)} value={selectedSection}>
          <option value="">Select Section</option>
          {[...new Set(students.map((student) => student.section))].map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>
      <div className="buttons">
        <button className="button" onClick={handleDeleteSelected}>
          Delete Selected
        </button>
        <button
          className="button"
          onClick={() => {
            if (selectedStudents.length === 0) {
              alert('Please select at least one student to edit.');
            } else {
              setIsBulkEditPopupOpen(true);
            }
          }}
        >
          Edit Selected
        </button>
      </div>
      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedStudents(
                      e.target.checked
                        ? filteredStudents.map((student) => student.id)
                        : []
                    )
                  }
                  checked={
                    selectedStudents.length > 0 &&
                    selectedStudents.length === filteredStudents.length
                  }
                />
              </th>
              <th>LRN</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Section</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className={selectedStudents.includes(student.id) ? 'selected' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentSelection(student.id)}
                  />
                </td>
                <td>{student.lrn}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Edit Popup */}
      {isBulkEditPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Edit Selected Students</h2>
            <form>
              <label>
                Grade:
                <input
                  type="text"
                  name="grade"
                  value={bulkEditData.grade}
                  onChange={handleBulkEditChange}
                />
              </label>
              <label>
                Section:
                <input
                  type="text"
                  name="section"
                  value={bulkEditData.section}
                  onChange={handleBulkEditChange}
                />
              </label>
            </form>
            <div className="popup-buttons">
              <button className="button" onClick={handleBulkEditSave}>
                Save
              </button>
              <button
                className="button"
                onClick={() => setIsBulkEditPopupOpen(false)}
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

export default SortAndManageStudents;