import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetaljiProjekat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [projekat, setProjekat] = useState({ naziv: '', opis: '', odgovor: '' });
    
    const user = JSON.parse(localStorage.getItem('user')); 
    const isStudent = user?.studentID || user?.role === 'student';
    const isNastavnik = !isStudent; 

    useEffect(() => {
        const fetchProjekat = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/projekat/${id}?tip=pojedinacno`, {
                    headers: { Authorization: token }
                });
                if (res.data) {
                    setProjekat(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProjekat();
    }, [id]);

    // DODATA FUNKCIJA ZA DOWNLOAD PDF-a NA OVOJ STRANICI
    const handleDownloadPDF = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/projekat/download/${id}`, {
                headers: { Authorization: token },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Dokumentacija_${projekat.naziv.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Greška pri preuzimanju PDF-a.");
        }
    };

    const handleSave = async () => {
    let payload = {};
    if (isNastavnik) {
        if (!projekat.odgovor?.trim()) {
            alert("Morate uneti feedback pre slanja!");
            return;
        }
        payload = { odgovor: projekat.odgovor };
    } else {
        if (!projekat.naziv.trim() || !projekat.opis.trim()) {
            alert("Polja naziv i opis ne smeju biti prazna!");
            return;
        }
        // Šaljemo naziv, opis I ime studenta za PDF
        payload = { 
            naziv: projekat.naziv, 
            opis: projekat.opis,
            studentIme: `${user.ime} ${user.prezime}` 
        };
    }

    try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/projekat/update/${id}`, payload, {
            headers: { Authorization: token }
        });
        alert(isNastavnik ? "Feedback uspešno poslat!" : "Projekat i PDF uspešno ažurirani!");
        navigate('/home');
    } catch (err) {
        alert("Greška pri čuvanju.");
    }
};

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', minHeight: '100vh', backgroundColor: '#f0f2f5', margin: 0, padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: '650px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <h1 style={{ marginTop: 0, marginBottom: '10px', fontSize: '28px', color: '#1a202c', fontWeight: '800' }}>
                        {isNastavnik ? "Pregled rada" : "Izmena projekta"}
                    </h1>
                    {/* DUGME ZA DOWNLOAD PDF-a */}
                    <button 
                        onClick={handleDownloadPDF}
                        style={{backgroundColor: '#edf2f7', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#2d3748'}}
                    >
                        📥 Preuzmi PDF
                    </button>
                </div>
                
                {isNastavnik && projekat.ime && (
                    <p style={{ color: '#718096', marginBottom: '30px', fontWeight: '600', fontSize: '16px' }}>
                        Student: {projekat.ime} {projekat.prezime}
                    </p>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: '700', display: 'block', marginBottom: '8px', color: '#4a5568' }}>Naziv projekta:</label>
                    <input 
                        type="text"
                        value={projekat.naziv || ''} 
                        readOnly={isNastavnik}
                        onChange={(e) => !isNastavnik && setProjekat({...projekat, naziv: e.target.value})}
                        style={{ 
                            width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box', outline: 'none',
                            backgroundColor: isNastavnik ? '#f8fafc' : '#ffffff',
                            color: isNastavnik ? '#718096' : '#2d3748',
                            cursor: isNastavnik ? 'not-allowed' : 'text'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: '700', display: 'block', marginBottom: '8px', color: '#4a5568' }}>Opis rada:</label>
                    <textarea 
                        value={projekat.opis || ''} 
                        readOnly={isNastavnik}
                        onChange={(e) => !isNastavnik && setProjekat({...projekat, opis: e.target.value})}
                        style={{ 
                            width: '100%', height: '160px', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', boxSizing: 'border-box', resize: 'none', outline: 'none',
                            backgroundColor: isNastavnik ? '#f8fafc' : '#ffffff',
                            color: isNastavnik ? '#718096' : '#2d3748',
                            cursor: isNastavnik ? 'not-allowed' : 'default'
                        }}
                    />
                </div>

                <div style={{ 
                    marginBottom: '35px', padding: '25px', borderRadius: '16px',
                    backgroundColor: isNastavnik ? '#fffaf0' : '#f0f7ff', 
                    border: isNastavnik ? '2px dashed #fbd38d' : '1px solid #bee3f8' 
                }}>
                    <label style={{ fontWeight: '800', display: 'block', marginBottom: '12px', color: isNastavnik ? '#dd6b20' : '#2b6cb0', textTransform: 'uppercase', fontSize: '12px' }}>
                        {isNastavnik ? "VAŠ KOMENTAR I SUGESTIJE (FEEDBACK):" : "KOMENTAR NASTAVNIKA:"}
                    </label>
                    
                    {isNastavnik ? (
                        <textarea 
                            value={projekat.odgovor || ''}
                            onChange={(e) => setProjekat({...projekat, odgovor: e.target.value})}
                            placeholder="Napišite studentu šta treba da popravi..."
                            style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '10px', border: '1px solid #fbd38d', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
                        />
                    ) : (
                        <p style={{ color: '#2c5282', fontStyle: 'italic', margin: 0, lineHeight: '1.6', fontSize: '16px' }}>
                            {projekat.odgovor || "Nastavnik još uvek nije ostavio komentar."}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    {isNastavnik ? (
                        <button 
                            onClick={handleSave} 
                            style={{ flex: 2, padding: '16px', backgroundColor: '#ed8936', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}
                        >
                            🚀 Pošalji feedback studentu
                        </button>
                    ) : (
                        <button 
                            onClick={handleSave} 
                            style={{ flex: 2, padding: '16px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '16px' }}
                        >
                            💾 Sačuvaj moje izmene
                        </button>
                    )}
                    <button onClick={() => navigate('/home')} style={{ flex: 1, padding: '16px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
                        Odustani
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetaljiProjekat;