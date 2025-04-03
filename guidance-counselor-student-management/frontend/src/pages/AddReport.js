import React, { useState } from 'react';
import '../css/styles.css';

const AddReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [details, setDetails] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [offenseType, setOffenseType] = useState('');
  const [reason, setReason] = useState('');

  // Mock data for demonstration
  const mockData = {
    "John Doe": { age: 25, occupation: "Software Engineer" },
    "Jane Smith": { age: 30, occupation: "Data Scientist" },
    "Jack Johnson": { age: 22, occupation: "Graphic Designer" },
    "Jill Brown": { age: 28, occupation: "Marketing Specialist" },
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (mockData[searchTerm]) {
      setDetails(mockData[searchTerm]);
    } else {
      setDetails({ error: "No details found for this name." });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter suggestions based on the input
    if (value) {
      const filteredSuggestions = Object.keys(mockData).filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name); // Set the selected name in the search bar
    setSuggestions([]); // Clear the suggestions
  };

  const handleAddOffense = () => {
    if (!offenseType || !reason) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    // Simulate adding the offense to the database
    console.log('Adding offense:', {
      name: searchTerm,
      offenseType,
      reason,
    });

    alert(`Offense added for ${searchTerm}: ${offenseType} - ${reason}`);

    // Clear the form fields
    setOffenseType('');
    setReason('');
    setDetails(null);
    setSearchTerm('');
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
            {suggestions.map((name) => (
              <li
                key={name}
                onClick={() => handleSuggestionClick(name)}
                style={{
                  padding: '5px',
                  cursor: 'pointer',
                }}
              >
                {name}
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
              <h2>{searchTerm}</h2>
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
                    <option value="Bullying">Bullying</option>
                    <option value="Cheating">Cheating</option>
                    <option value="Vandalism">Vandalism</option>
                    <option value="Disrespect">Disrespect</option>
                  </select>
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>
                  <strong>Reason:</strong>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter a reason"
                    style={{
                      marginLeft: '10px',
                      padding: '5px',
                      width: '300px',
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