import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ManageStudentsByGrade.css'; // Add styles for this page

const ManageStudentsByGrade = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students for the table
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [file, setFile] = useState(null);
  const [gradeCounts, setGradeCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState([]); // State to store sections for the selected grade
  const [selectedSection, setSelectedSection] = useState(''); // Currently selected section
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State to toggle the edit popup
  const [editedStudent, setEditedStudent] = useState(null); // State to store the edited student
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false); // State to toggle the add popup
const [newStudent, setNewStudent] = useState({
  lrn: '',
  name: '',
  grade: selectedGrade,
  section: '',
  sex: 'M',
  birthdate: '',
  mother_tongue: '',
  religion: '',
  barangay: '',
  municipality_city: '',
  father_name: '',
  mother_name: '',
  guardian_name: '',
  contact_number: '',
});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all students from the backend
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students');
        const data = await response.json();
        setStudents(data);

        // Calculate the count of students for each grade
        const counts = data.reduce((acc, student) => {
          acc[student.grade] = (acc[student.grade] || 0) + 1;
          return acc;
        }, {});
        setGradeCounts(counts);

        // Update sections for the initially selected grade
        updateSections(data, selectedGrade);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Add keybind logic for Ctrl + Shift + D
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        setShowDeleteAll((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // Update sections and filtered students whenever the selected grade changes
    updateSectionsAndFilteredStudents(students, selectedGrade);
  }, [selectedGrade, students]);

    // Function to update sections and filtered students based on the selected grade
  const updateSectionsAndFilteredStudents = (students, grade) => {
    const gradeSections = [...new Set(students.filter(student => student.grade === grade).map(student => student.section))];
    setSections(gradeSections);
    setFilteredStudents(students.filter(student => student.grade === grade));
    setSelectedSection(''); // Reset the selected section
  };


  const handleGradeSelection = (grade) => {
    setSelectedGrade(grade);
  };

   // Handle sorting by section
   const handleSortBySection = (section) => {
    setSelectedSection(section);
    if (section === '') {
      // If no section is selected, show all students for the selected grade
      setFilteredStudents(students.filter(student => student.grade === selectedGrade));
    } else {
      // Filter students by the selected section
      setFilteredStudents(students.filter(student => student.grade === selectedGrade && student.section === section));
    }
  };


  // Filter students by the selected grade and search query
  const searchedStudents = students.filter(
    (student) =>
      student.grade === selectedGrade &&
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  ); // Use this searchedStudents directly


  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setFile(null); // Clear the file input
        // Optionally, refresh the student list
        const updatedStudents = await fetch('http://localhost:5000/api/students');
        const updatedData = await updatedStudents.json();
        setStudents(updatedData);

        // Recalculate the count of students for each grade
        const counts = updatedData.reduce((acc, student) => {
          acc[student.grade] = (acc[student.grade] || 0) + 1;
          return acc;
        }, {});
        setGradeCounts(counts);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAdd = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });
  
      if (response.ok) {
        alert('Student added successfully.');
        const updatedStudents = await fetch('http://localhost:5000/api/students');
        const updatedData = await updatedStudents.json();
        setStudents(updatedData);
  
        // Recalculate the count of students for each grade
        const counts = updatedData.reduce((acc, student) => {
          acc[student.grade] = (acc[student.grade] || 0) + 1;
          return acc;
        }, {});
        setGradeCounts(counts);
  
        setIsAddPopupOpen(false); // Close the popup
        setNewStudent({
          lrn: '',
          name: '',
          grade: selectedGrade,
          section: '',
          sex: 'M',
          birthdate: '',
          mother_tongue: '',
          religion: '',
          barangay: '',
          municipality_city: '',
          father_name: '',
          mother_name: '',
          guardian_name: '',
          contact_number: '',
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('An error occurred while adding the student.');
    }
  };

  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  // Handle delete student
  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Student deleted successfully.');
        setStudents(students.filter((student) => student.id !== id));
        setSelectedStudent(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('An error occurred while deleting the student.');
    }
  };

  // Handle delete all students
  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/delete_all_students', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('All students deleted successfully.');
        setStudents([]);
        setGradeCounts({});
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting all students:', error);
      alert('An error occurred while deleting all students.');
    }
  };

  // Navigate to the profile page
  const handleViewProfile = () => {
    if (selectedStudent) {
      navigate(`/students/${selectedStudent.lrn}`);
    } else {
      alert('Please select a student to view their profile.');
    }
  };

  // Handle double-click on a student row
  const handleRowDoubleClick = (student) => {
    navigate(`/students/${student.lrn}`);
  };

  // Open the edit popup
  const handleEditStudent = () => {
    if (selectedStudent) {
      setEditedStudent({ ...selectedStudent }); // Populate the form with the selected student's data
      setIsEditPopupOpen(true);
    } else {
      alert('Please select a student to edit.');
    }
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Save the edited student
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
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === editedStudent.id ? editedStudent : student
          )
        );
        setIsEditPopupOpen(false);
        setSelectedStudent(editedStudent); // Update the selected student
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('An error occurred while updating the student.');
    }
  };

  // Close the edit popup
  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
  };

  return (
    <div className="manage-students-container">
      <header className="manage-students-header">
        <h1>Manage Students by Grade</h1>
      </header>
      <div className="grade-buttons">
        {['Grade 10', 'Grade 9', 'Grade 8', 'Grade 7'].map((grade) => (
          <button
            key={grade}
            className={`grade-button ${selectedGrade === grade ? 'active' : ''}`}
            onClick={() => handleGradeSelection(grade)}
          >
            {grade} ({gradeCounts[grade] || 0})
          </button>
        ))}
      </div>
      <div className="buttons">
      <button className="button" onClick={() => setIsAddPopupOpen(true)}>
          Add Student
        </button>
        <button className="button" onClick={handleEditStudent}>
          Edit Student
        </button>
        <button
          className="button"
          onClick={() =>
            selectedStudent
            ? alert(`Delete Student: ${selectedStudent.name}`)
            : alert('Please select a student to delete.')
          }
        >
          Delete Student
        </button>
        <button
          className="button"
          onClick={handleViewProfile}
          disabled={!selectedStudent}
        >
          View Profile
        </button>
        {showDeleteAll && (
          <button className="button delete-all-button" onClick={handleDeleteAll}>
            Delete All Data
          </button>
        )}
        <div className="upload-container">
          <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
          <button className="uploadbutton" onClick={handleUpload}>
            Upload Data
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="button" onClick={() => alert(`Searching for: ${searchQuery}`)}>
            Search
          </button>
          <select
            className="sort"
            onChange={(e) => handleSortBySection(e.target.value)}
          >
            <option value="">Sort by Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="students-table-container">
        <h2>{selectedGrade}</h2>
        <table className="students-table">
          <thead>
            <tr>
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
                onClick={() => setSelectedStudent(student)}
                onDoubleClick={() => handleRowDoubleClick(student)}
                className={selectedStudent?.id === student.id ? 'selected' : ''}
              >
                <td>{student.lrn}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAddPopupOpen && (
  <div className="popup-overlay">
    <div className="popup-large">
      <h2>Add Student</h2>
      <form>
        <label>
          LRN:
          <input
            type="text"
            name="lrn"
            value={newStudent.lrn}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={newStudent.name}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Grade:
          <input
            type="text"
            name="grade"
            value={newStudent.grade}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Section:
          <input
            type="text"
            name="section"
            value={newStudent.section}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Sex:
          <select
            name="sex"
            value={newStudent.sex}
            onChange={handleAddChange}
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
            value={newStudent.birthdate}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Mother Tongue:
          <input
            type="text"
            name="mother_tongue"
            value={newStudent.mother_tongue}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Religion:
          <input
            type="text"
            name="religion"
            value={newStudent.religion}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Barangay:
          <input
            type="text"
            name="barangay"
            value={newStudent.barangay}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Municipality/City:
          <input
            type="text"
            name="municipality_city"
            value={newStudent.municipality_city}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Father's Name:
          <input
            type="text"
            name="father_name"
            value={newStudent.father_name}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Mother's Name:
          <input
            type="text"
            name="mother_name"
            value={newStudent.mother_name}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Guardian's Name:
          <input
            type="text"
            name="guardian_name"
            value={newStudent.guardian_name}
            onChange={handleAddChange}
          />
        </label>
        <label>
          Contact Number:
          <input
            type="text"
            name="contact_number"
            value={newStudent.contact_number}
            onChange={handleAddChange}
          />
        </label>
      </form>
      <div className="popup-buttons">
        <button className="button" onClick={handleSaveAdd}>
          Save
        </button>
        <button className="button" onClick={handleCloseAddPopup}>
          Cancel
        </button>
      </div>
    </div>
  </div>
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

export default ManageStudentsByGrade;