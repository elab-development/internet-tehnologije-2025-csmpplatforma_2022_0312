import React from 'react';

const CustomButton = ({ text, onClick, type = "button", color = "#28a745" }) => (
  <button 
    type={type} 
    onClick={onClick} 
    style={{ 
      backgroundColor: color, 
      color: 'white', 
      padding: '12px 25px', 
      border: 'none', 
      borderRadius: '5px', 
      cursor: 'pointer',
      width: '100%',
      fontSize: '16px',
      marginTop: '10px'
    }}
  >
    {text}
  </button>
);

export default CustomButton;