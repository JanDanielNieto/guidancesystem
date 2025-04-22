import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    lrn: '',
    name: '',
    grade: 'Grade 10',
    section: '',
    sex: 'Male',
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

  // Define sections for each grade
  const sectionsByGrade = {
    'Grade 10': ['Section A', 'Section B', 'Section C'],
    'Grade 9': ['Section D', 'Section E', 'Section F'],
    'Grade 8': ['Section G', 'Section H', 'Section I'],
    'Grade 7': ['Section J', 'Section K', 'Section L'],
  };

  // Update form data when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset the section if the grade changes
    if (name === 'grade') {
      setFormData({ ...formData, grade: value, section: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Student added successfully!');
        navigate('/'); // Redirect to the main page
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('An error occurred while adding the student.');
    }
  };

  return (
    <div className="add-student-container">
      <h1>Add Student</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>LRN:</label>
          <input type="text" name="lrn" value={formData.lrn} onChange={handleChange} required />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Grade:</label>
          <select name="grade" value={formData.grade} onChange={handleChange}>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 7">Grade 7</option>
          </select>
        </div>
        <div>
          <label>Section:</label>
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
            disabled={!sectionsByGrade[formData.grade]} // Disable if no grade is selected
          >
            <option value="">Select Section</option>
            {sectionsByGrade[formData.grade]?.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Gender:</label>
          <select name="sex" value={formData.sex} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Birthdate:</label>
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
        </div>
        <div>
          <label>Mother Tongue:</label>
          <input type="text" name="mother_tongue" value={formData.mother_tongue} onChange={handleChange} />
        </div>
        <div>
          <label>Religion:</label>
          <input type="text" name="religion" value={formData.religion} onChange={handleChange} />
        </div>
        <div>
          <label>Barangay:</label>
          <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} />
        </div>
        <div>
          <label>Municipality/City:</label>
          <input type="text" name="municipality_city" value={formData.municipality_city} onChange={handleChange} />
        </div>
        <div>
          <label>Father's Name:</label>
          <input type="text" name="father_name" value={formData.father_name} onChange={handleChange} />
        </div>
        <div>
          <label>Mother's Name:</label>
          <input type="text" name="mother_name" value={formData.mother_name} onChange={handleChange} />
        </div>
        <div>
          <label>Guardian's Name:</label>
          <input type="text" name="guardian_name" value={formData.guardian_name} onChange={handleChange} />
        </div>
        <div>
          <label>Contact Number:</label>
          <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} />
        </div>
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;