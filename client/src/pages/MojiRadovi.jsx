import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MojiRadovi = () => {
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [radovi, setRadovi] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMojiRadovi = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/predaja/student/${user.studentID}`, {
                    headers: { Authorization: token }
                });
                setRadovi(res.data);
            } catch (err) {
                console.error("Greška pri učitavanju radova", err);
            }
        };
        fetchMojiRadovi();
    }, [user]);

    return (
        <div style={pageWrapperStyle}>
            
            <button onClick={() => navigate('/home')} style={backButtonStyle}>
                ← Nazad na početnu
            </button>
            
            <h2 style={pageTitleStyle}>Moja istorija predaja</h2>
            
            
            <div style={listContainerStyle}>
                {radovi.map(r => (
                    <div key={r.predajaID} style={workCardStyle}>
                        <div style={cardHeaderStyle}>
                            <span style={testNameStyle}>{r.vrstaTesta}</span>
                            <span style={dateStyle}>{new Date(r.datumPredaje).toLocaleDateString()}</span>
                        </div>
                        
                        <div style={contentBoxStyle}>
                            <p style={contentTextStyle}>{r.sadrzajRada}</p>
                        </div>

                        {r.ocenaVrednost ? (
                            <div style={gradeBoxStyle}>
                                <div style={gradeTitleStyle}>
                                    Ocena: {r.ocenaVrednost}
                                </div>
                                {r.ocenaKomentar && (
                                    <p style={commentStyle}>
                                        "{r.ocenaKomentar}"
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div style={pendingBoxStyle}>
                                Još uvek nije ocenjeno
                            </div>
                        )}
                    </div>
                ))}

                {radovi.length === 0 && (
                    <p style={{fontSize: '18px', color: '#718096'}}>Niste predali nijedan rad do sada.</p>
                )}
            </div>
        </div>
    );
};



const pageWrapperStyle = {
    padding: '60px 50px', 
    backgroundColor: '#f8fafc', 
    minHeight: '100vh', 
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start' 
};

const backButtonStyle = {
    marginBottom: '30px', 
    cursor: 'pointer', 
    border: 'none', 
    background: 'none', 
    color: '#4a5568', 
    fontWeight: '700',
    fontSize: '16px',
    padding: '0'
};

const pageTitleStyle = {
    marginBottom: '40px', 
    color: '#1a202c', 
    fontSize: '32px', 
    fontWeight: '800'
};

const listContainerStyle = {
    display: 'flex', 
    flexDirection: 'column', 
    gap: '25px', 
    width: '90%', 
    maxWidth: '1400px' 
};

const workCardStyle = {
    backgroundColor: '#fff', 
    padding: '30px', 
    borderRadius: '20px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
    border: '1px solid #e2e8f0',
    width: '100%' 
};

const cardHeaderStyle = {
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: '20px',
    alignItems: 'center'
};

const testNameStyle = {
    fontWeight: '800', 
    color: '#2d3748', 
    fontSize: '20px'
};

const dateStyle = {
    fontSize: '14px', 
    color: '#a0aec0',
    fontWeight: '600'
};

const contentBoxStyle = {
    backgroundColor: '#f8fafc', 
    padding: '20px', 
    borderRadius: '12px', 
    marginBottom: '20px',
    border: '1px solid #f1f5f9'
};

const contentTextStyle = {
    fontSize: '16px', 
    margin: 0, 
    color: '#4a5568', 
    lineHeight: '1.6'
};

const gradeBoxStyle = {
    backgroundColor: '#f0fff4', 
    padding: '20px', 
    borderRadius: '12px', 
    border: '1px solid #c6f6d5'
};

const gradeTitleStyle = {
    color: '#2f855a', 
    fontWeight: '800', 
    fontSize: '18px'
};

const commentStyle = {
    margin: '10px 0 0 0', 
    fontSize: '15px', 
    color: '#38a169', 
    fontStyle: 'italic',
    fontWeight: '500'
};

const pendingBoxStyle = {
    backgroundColor: '#fffaf0', 
    padding: '15px', 
    borderRadius: '12px', 
    border: '1px solid #feebc8', 
    color: '#c05621', 
    fontSize: '15px', 
    textAlign: 'center',
    fontWeight: '600'
};

export default MojiRadovi;