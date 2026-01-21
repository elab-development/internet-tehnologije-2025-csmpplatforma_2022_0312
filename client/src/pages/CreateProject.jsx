import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProject = () => {
    const [naziv, setNaziv] = useState('');
    const [opis, setOpis] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        
        const currentID = user.studentID || user.id;

        
        const config = { 
            headers: { Authorization: token } 
        };

        await axios.post('http://localhost:5000/api/projekat/add', {
            naziv,
            opis,
            studentID: currentID 
        }, config);

        alert("Projekat uspešno kreiran!");
        navigate('/home'); 
    } catch (err) {
        console.error("Greška detalji:", err.response?.data);
        alert(err.response?.data?.message || "Greška pri kreiranju projekta");
    }
};

    return (
        <div style={containerStyle}>
            <div style={formCardStyle}>
                <h2>Novi CSMP Projekat</h2>
                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label>Naziv projekta:</label>
                        <input 
                            type="text" 
                            value={naziv} 
                            onChange={(e) => setNaziv(e.target.value)} 
                            required 
                            style={inputStyle}
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <label>Opis:</label>
                        <textarea 
                            value={opis} 
                            onChange={(e) => setOpis(e.target.value)} 
                            style={{...inputStyle, height: '100px'}}
                        />
                    </div>
                    <button type="submit" style={buttonStyle}>Kreiraj Projekat</button>
                    <button type="button" onClick={() => navigate('/home')} style={cancelButtonStyle}>Odustani</button>
                </form>
            </div>
        </div>
    );
};


const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' };
const formCardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '400px' };
const inputGroupStyle = { marginBottom: '20px', textAlign: 'left' };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#4681d8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const cancelButtonStyle = { width: '100%', padding: '10px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };

export default CreateProject;