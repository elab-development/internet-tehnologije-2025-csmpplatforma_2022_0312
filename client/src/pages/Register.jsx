import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 

import axios from 'axios';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const Register = () => {
    const [userData, setUserData] = useState({ ime: '', prezime: '', username: '', password: '' });
    const navigate = useNavigate();
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Ovde gađamo tvoju rutu za registraciju studenta
            await axios.post('http://localhost:5000/api/students/register', userData);
            alert("Uspešna registracija!");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Greška pri registraciji");
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: '#4a90e2', // Ista plava pozadina kao na loginu
            position: 'fixed',
            top: 0,
            left: 0
        }}>
            <div style={{ 
                width: '600px', 
                padding: '50px', 
                backgroundColor: 'white',
                borderRadius: '15px', 
                boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                textAlign: 'center'
            }}>
                <h1 style={{ marginBottom: '30px', color: '#1a1a1a', fontSize: '32px' }}>
                    Registracija 
                </h1>
                
                <form onSubmit={handleRegister}>
                    <div style={{ fontSize: '18px' }}>
                        <InputField label="Ime" name="ime" value={userData.ime} onChange={handleChange} placeholder="Unesite vaše ime" />
                        <InputField label="Prezime" name="prezime" value={userData.prezime} onChange={handleChange} placeholder="Unesite vaše prezime" />
                        <InputField label="Korisničko ime" name="username" value={userData.username} onChange={handleChange} placeholder="Izaberite username" />
                        <InputField label="Lozinka" type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Izaberite lozinku" />
                    </div>
                    
                    <div style={{ marginTop: '40px' }}>
                        <CustomButton text="Kreiraj nalog" type="submit" color="#007bff" />
                    </div>
                </form>

                <p style={{ marginTop: '30px', fontSize: '18px' }}>
                    Već imate nalog? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Prijavite se</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;