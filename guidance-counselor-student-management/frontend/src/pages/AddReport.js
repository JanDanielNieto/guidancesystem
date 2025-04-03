import React, { useState } from 'react';
import '../css/styles.css';

const AddReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [details, setDetails] = useState(null);

  // Mock data for demonstration
  const mockData = {
    "John Doe": { age: 25, occupation: "Software Engineer" },
    "Jane Smith": { age: 30, occupation: "Data Scientist" },
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (mockData[searchTerm]) {
      setDetails(mockData[searchTerm]);
    } else {
      setDetails({ error: "No details found for this name." });
    }
  };

  return (
    <div class="dashboard-container">
      <h1>Search Page</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter a name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {details && (
        <div>
          {details.error ? (
            <p>{details.error}</p>
          ) : (
            <div>
              <h2>{searchTerm}</h2>
              <p>Age: {details.age}</p>
              <p>Occupation: {details.occupation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddReport;