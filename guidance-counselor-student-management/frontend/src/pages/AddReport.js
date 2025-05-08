import React, { useState, useEffect } from 'react';
import '../css/styles.css';
import { useLocation } from 'react-router-dom';
import config from '../config';


const AddReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [details, setDetails] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [offenseType, setOffenseType] = useState('');
  const [reason, setReason] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get('studentId');


  useEffect(() => {
    if (studentId) {
      fetch(`${config.API_BASE_URL}/students/${studentId}`)
        .then((response) => response.json())
        .then((data) => setDetails(data))
        .catch((error) => console.error('Error fetching student details:', error));
    }
  }, [studentId]);

    const handleSearch = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/students/search?query=${searchTerm}`);
        const data = await response.json();
        setSuggestions(data); // Populate suggestions with the search results
        if (data.length === 1) {
          setDetails(data[0]); // Automatically select the student if only one result
        } else {
          setDetails(null); // Clear details if multiple results
        }
      } catch (error) {
        console.error('Error searching for student:', error);
        setDetails({ error: "An error occurred while searching." });
      }
    };

  const handleInputChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);

  // Filter suggestions based on the input
  if (value) {
    const filteredSuggestions = suggestions.filter((student) =>
      student.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  } else {
    setSuggestions([]);
  }
};

  const handleSuggestionClick = (student) => {
    setSearchTerm(student.name); // Set the selected student's name in the search bar
    setDetails(student); // Set the selected student's details
    setSuggestions([]); // Clear the suggestions
  };

  const handleAddOffense = async () => {
    if (!offenseType) {
      alert('Please select an offense type before submitting.');
      return;
    }
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/students/${details.id}/offenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offense_type: offenseType, reason }), // Reason can be empty
      });
  
      if (response.ok) {
        alert(`Offense added for ${details.name}: ${offenseType}${reason ? ` - ${reason}` : ''}`);
        setOffenseType('');
        setReason('');
        setDetails(null);
        setSearchTerm('');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding offense:', error);
      alert('An error occurred while adding the offense.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Add Offense</h1>
      <form onSubmit={handleSearch} style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Enter a name"
          value={searchTerm}
          onChange={handleInputChange}
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3498db',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Search
        </button>

        {/* Dropdown for suggestions */}
          {suggestions.length > 0 && (
            <ul
              style={{
                position: 'absolute',
                top: '50px',
                left: '0',
                width: '300px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: 'white',
                listStyleType: 'none',
                padding: '10px',
                margin: '0',
                zIndex: 1000,
              }}
            >
              {suggestions.map((student) => (
                <li
                  key={student.id}
                  onClick={() => handleSuggestionClick(student)}
                  style={{
                    padding: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {student.name} ({student.lrn})
                </li>
              ))}
            </ul>
          )}
      </form>

      {details && (
        <div style={{ marginTop: '20px' }}>
          {details.error ? (
            <p style={{ color: 'red' }}>{details.error}</p>
          ) : (
            <div>
              <h2>{details.name}</h2>
              <p>Grade: {details.grade}</p>
              <p>Section: {details.section}</p>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <strong>Offense Type:</strong>
                  <select
                    value={offenseType}
                    onChange={(e) => setOffenseType(e.target.value)}
                    style={{
                      marginLeft: '10px',
                      padding: '5px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <option value="">Select an offense</option>
                    <option value="Bullying">Light Offense</option>
                    <option value="Cheating">Less Serious or Less Grave Offense</option>
                    <option value="Vandalism">Serious or Grave Offense</option>
                  </select>
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <strong>Reason:</strong>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter a reason"
                    style={{
                      marginLeft: '10px',
                      padding: '5px',
                      width: '300px',
                      height: '100px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                    }}
                  />
                </label>
              </div>
              <button
                onClick={handleAddOffense}
                style={{
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Add Offense
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddReport;