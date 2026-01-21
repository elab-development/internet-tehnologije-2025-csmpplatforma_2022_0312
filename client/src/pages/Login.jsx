import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '', kod: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    
    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
        
        console.log("Odgovor sa servera:", res.data);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert(res.data.message);

        // POPRAVKA: Čitamo role iz res.data.user
        const userRole = res.data.user.role; 

        if (userRole === 'admin') {
            navigate('/AdminHome'); // Proveri da li se ruta u App.jsx zove isto ovako
        } else {
            navigate('/home');
        }
    } catch (err) {
        alert(err.response?.data?.message || "Greška pri prijavi");
    }
};

    
    return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', // Centriranje levo-desno
        alignItems: 'center',     // Centriranje gore-dole
        width: '100vw',           // Puna širina ekrana
        height: '100vh',          // Puna visina ekrana
        backgroundColor: '#4681d8',
        position: 'fixed',        // Da bi ignorisao druge stilove
        top: 0,
        left: 0
    }}>
        <div style={{ 
            width: '600px',       // Dodatno povećana širina (bilo je 500)
            padding: '50px',      // Više prostora unutar forme
            backgroundColor: 'white',
            borderRadius: '15px', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            textAlign: 'center'
        }}>
            <h1 style={{ marginBottom: '40px', color: '#1a1a1a', fontSize: '32px' }}>
                Prijava na CSMP platformu
            </h1>
            
            <form onSubmit={handleLogin}>
                <div style={{ fontSize: '20px' }}> {/* Povećan font za ceo input deo */}
                    <InputField 
                        label="Korisničko ime" 
                        name="username" 
                        value={credentials.username} 
                        onChange={handleChange} 
                        placeholder="Unesite username" 
                    />
                    <InputField 
                        label="Lozinka" 
                        type="password" 
                        name="password" 
                        value={credentials.password} 
                        onChange={handleChange} 
                        placeholder="Unesite lozinku" 
                    />
                </div>
                
                <div style={{ margin: '30px 0', display: 'flex', alignItems: 'center' }}>
                    <hr style={{ flex: 1, border: '0.5px solid #eee' }} />
                    <span style={{ padding: '0 15px', color: '#888', fontSize: '16px' }}>Administrator</span>
                    <hr style={{ flex: 1, border: '0.5px solid #eee' }} />
                </div>

                <InputField 
                    label="Admin Kod" 
                    name="kod" 
                    value={credentials.kod} 
                    onChange={handleChange} 
                    placeholder="Unesite tajni kod" 
                />
                
                <div style={{ marginTop: '40px' }}>
                    <CustomButton text="Uloguj se" type="submit" color="#007bff" />
                </div>
            </form>

            
        </div>
    </div>
);
};

export default Login;