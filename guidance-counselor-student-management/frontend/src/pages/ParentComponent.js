// filepath: c:\Users\dropt\.vscode\guidancesystem\guidancesystem\guidance-counselor-student-management\frontend\src\pages\ParentComponent.js
import React, { useState } from 'react';
import Popup from './Popup'; // Import the Popup component

const ParentComponent = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Upload File Example</h1>
      <button
        onClick={openPopup}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Open Upload Popup
      </button>
      <Popup isOpen={isPopupOpen} onClose={closePopup} />
    </div>
  );
};

export default ParentComponent;