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
            const punoIme = `${user.ime} ${user.prezime}`;

            const config = { 
                headers: { Authorization: token } 
            };

            
            await axios.post('http://localhost:5000/api/projekat/add', {
                naziv,
                opis,
                studentID: currentID,
                studentIme: punoIme 
            }, config);

            alert("Projekat i zvanična PDF dokumentacija su uspešno kreirani!");
            navigate('/home'); 
        } catch (err) {
            console.error("Greška detalji:", err.response?.data);
            alert(err.response?.data?.message || "Greška pri kreiranju projekta");
        }
    };

    return (
        <div style={containerStyle}>
            <div style={formCardStyle}>
                <h1 style={titleStyle}>Novi CSMP Projekat</h1>
                <p style={subtitleStyle}>Unesite podatke o vašem radu</p>
                
                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Naziv projekta:</label>
                        <input 
                            type="text" 
                            placeholder="Unesite naslov projekta..."
                            value={naziv} 
                            onChange={(e) => setNaziv(e.target.value)} 
                            required 
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Opis rada:</label>
                        <textarea 
                            placeholder="Opišite vašu ideju, ciljeve i tehnologije..."
                            value={opis} 
                            onChange={(e) => setOpis(e.target.value)} 
                            style={textareaStyle}
                            required
                        />
                    </div>

                    <div style={buttonContainerStyle}>
                        <button type="submit" style={submitButtonStyle}>
                             Kreiraj Projekat
                        </button>
                        <button type="button" onClick={() => navigate('/home')} style={cancelButtonStyle}>
                            Odustani
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const containerStyle = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100vw',
    minHeight: '100vh', 
    backgroundColor: '#f0f2f5', 
    margin: 0, 
    padding: '20px',
    boxSizing: 'border-box'
};

const formCardStyle = { 
    backgroundColor: '#ffffff', 
    padding: '40px', 
    borderRadius: '24px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
    width: '100%',
    maxWidth: '550px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
};

const titleStyle = { 
    marginTop: 0, 
    marginBottom: '10px', 
    fontSize: '28px', 
    color: '#1a202c', 
    textAlign: 'center', 
    fontWeight: '800' 
};

const subtitleStyle = {
    textAlign: 'center',
    color: '#718096',
    marginBottom: '30px',
    fontSize: '15px',
    lineHeight: '1.5'
};

const inputGroupStyle = { marginBottom: '20px' };
const labelStyle = { fontWeight: '700', display: 'block', marginBottom: '8px', color: '#4a5568' };
const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s', color: '#2d3748' };
const textareaStyle = { ...inputStyle, height: '150px', resize: 'none', fontFamily: 'inherit' };
const buttonContainerStyle = { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' };
const submitButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', transition: 'background-color 0.2s' };
const cancelButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' };

export default CreateProject;