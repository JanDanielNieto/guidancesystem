import React, { useState } from 'react';
import '../css/styles.css';

const Popup = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    // Simulate file upload
    alert(`File "${selectedFile.name}" uploaded successfully!`);
    setSelectedFile(null);
    onClose(); // Close the popup after upload
  };

  if (!isOpen) return null; // Don't render the popup if it's not open

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>Upload File</h2>
        <input
          type="file"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        <div style={styles.buttonContainer}>
          <button onClick={handleUpload} style={styles.uploadButton}>
            Upload
          </button>
          <button onClick={onClose} style={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  fileInput: {
    margin: '10px 0',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Popup;