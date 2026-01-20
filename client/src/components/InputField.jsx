import React from 'react';

const InputField = ({ label, type, name, value, onChange, placeholder }) => (
  <div style={{ marginBottom: '15px', textAlign: 'left' }}>
    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      
      style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
    />
  </div>
);

export default InputField;