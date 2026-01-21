import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomButton from '../components/CustomButton';

const AdminHome = () => {
    const [studenti, setStudenti] = useState([]);
    const [nastavnici, setNastavnici] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert("Dovidjenja!");
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const config = { headers: { Authorization: token } };
                
                const resStudenti = await axios.get('http://localhost:5000/api/student/select', config);
                const resNastavnici = await axios.get('http://localhost:5000/api/nastavnik/select', config);
                
                setStudenti(resStudenti.data);
                setNastavnici(resNastavnici.data);
            } catch (err) {
                console.error("Greška pri učitavanju:", err);
                if (err.response?.status === 401) handleLogout();
            }
        };
        fetchData();
    }, [navigate]);

    const obrisiKorisnika = async (tip, id) => {
        
        if (!id) return alert("Greška: ID nije pronađen!");

        if (window.confirm(`Da li ste sigurni da želite brisanje?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/${tip}/delete/${id}`, {
                    headers: { Authorization: token }
                });

                
                if (tip === 'student') {
                    setStudenti(prev => prev.filter(s => s.studentID !== id));
                } else {
                    setNastavnici(prev => prev.filter(n => n.nastavnikID !== id));
                }
                alert("Uspešno obrisano!");
            } catch (err) {
                alert(err.response?.data?.message || "Greška pri brisanju");
            }
        }
    };

    return (
        <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            minHeight: '100vh', width: '100vw', backgroundColor: '#f0f2f5', 
            padding: '20px', boxSizing: 'border-box' 
        }}>
            <div style={{ width: '90%', maxWidth: '1200px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0, color: '#1a1a1a' }}>Glavna stranica</h1>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ transform: 'scale(0.8)', transformOrigin: 'right' }}>
                            <CustomButton text="+ Registruj Novog Studenta" onClick={() => navigate('/register')} color="#28a745" />
                        </div>
                        <div style={{ transform: 'scale(0.8)', transformOrigin: 'right' }}>
                            <CustomButton 
                                text="+ Registruj Novog Nastavnika" 
                                onClick={() => navigate('/registerN')} 
                                color="#17a2b8" 
                            />
                        </div>
                        <button 
                            onClick={handleLogout}
                            style={{ 
                                padding: '8px 15px', borderRadius: '8px', border: '1px solid #ccc',
                                backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            Odjavi se
                        </button>
                    </div>
                </div>

                
                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                    
                    
                    <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ borderBottom: '2px solid #4681d8', paddingBottom: '10px' }}>Studenti</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: '#666' }}>
                                    <th style={{ padding: '12px' }}>Ime i Prezime</th>
                                    <th style={{ padding: '12px' }}>Username</th>
                                    <th style={{ padding: '12px' }}>Akcija</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studenti.map(s => (
                                    <tr key={s.studentID} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{s.ime} {s.prezime}</td>
                                        <td style={{ padding: '12px' }}>{s.username}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button 
                                                onClick={() => obrisiKorisnika('student', s.studentID)} 
                                                style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Obriši
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    
                    <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ borderBottom: '2px solid #4681d8', paddingBottom: '10px' }}>Nastavnici</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: '#666' }}>
                                    <th style={{ padding: '12px' }}>Ime i Prezime</th>
                                    <th style={{ padding: '12px' }}>Username</th>
                                    <th style={{ padding: '12px' }}>Akcija</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nastavnici.map(n => (
                                    <tr key={n.nastavnikID} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{n.ime} {n.prezime}</td>
                                        <td style={{ padding: '12px' }}>{n.username}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button 
                                                onClick={() => obrisiKorisnika('nastavnik', n.nastavnikID)} 
                                                style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Obriši
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminHome;