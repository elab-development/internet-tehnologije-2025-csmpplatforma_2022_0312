import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const CreateSadrzaj = () => {
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [sveGrupe, setSveGrupe] = useState([]); 
    const [formData, setFormData] = useState({
        naziv: '',
        tip: '', 
        maxPoena: '',
        rok: '',
        pitanje: '',
        grupaID: '' 
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGrupe = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/grupa/select`, {
                    headers: { Authorization: token }
                });
                setSveGrupe(res.data);
            } catch (err) {
                console.error("Greška pri dovlačenju grupa:", err);
            }
        };
        fetchGrupe();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                naziv: formData.naziv,
                tip: formData.tip,
                maxPoena: formData.maxPoena,
                rok: formData.rok,
                pitanje: formData.pitanje,
                nastavnikID: user.nastavnikID
            };

            const resSadrzaj = await axios.post(`${API_URL}/sadrzaj/add`, dataToSend, {
                headers: { Authorization: token }
            });

            if (formData.tip.toLowerCase() === 'grupni rad' && formData.grupaID) {
                await axios.put(`${API_URL}/grupa/update/${formData.grupaID}`, 
                    { sadrzajID: resSadrzaj.data.sadrzajID },
                    { headers: { Authorization: token } }
                );
            }

            alert("Sadržaj uspešno kreiran!");
            navigate('/home');
        } catch (err) {
            console.error(err);
            alert("Greška pri kreiranju sadržaja.");
        }
    };

    return (
        <div style={containerStyle}>
            <div style={formCardStyle}>
                <h2 style={titleStyle}>Kreiraj novi sadržaj</h2>
                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Naziv predmeta</label>
                        <input 
                            name="naziv" 
                            style={inputStyle} 
                            onChange={handleChange} 
                            placeholder="Unesite naziv predmeta..." 
                            required 
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Tip</label>
                        <input 
                            name="tip" 
                            style={inputStyle} 
                            onChange={handleChange} 
                            placeholder="Unesite tip (npr. Grupni rad)..." 
                            required 
                        />
                    </div>

                    {formData.tip.toLowerCase() === 'grupni rad' && (
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Dodeli grupi</label>
                            <select 
                                name="grupaID" 
                                style={inputStyle} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Izaberite grupu kojoj je rad namenjen...</option>
                                {sveGrupe.map(g => (
                                    <option key={g.grupaID} value={g.grupaID}>
                                        {g.naziv} ({g.godina}. godina)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div style={{display: 'flex', gap: '20px'}}>
                        <div style={{...inputGroupStyle, flex: 1}}>
                            <label style={labelStyle}>Maksimalno poena</label>
                            <input 
                                type="number" 
                                name="maxPoena" 
                                style={inputStyle} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div style={{...inputGroupStyle, flex: 1}}>
                            <label style={labelStyle}>Rok za predaju</label>
                            <input 
                                type="date" 
                                name="rok" 
                                style={inputStyle} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Tekst pitanja / Opis zadatka</label>
                        <textarea 
                            name="pitanje" 
                            style={{...inputStyle, height: '180px', resize: 'vertical'}} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div style={{display: 'flex', gap: '20px', marginTop: '30px'}}>
                        <button type="submit" style={submitButtonStyle}>Kreiraj sadržaj</button>
                        <button type="button" onClick={() => navigate('/home')} style={backButtonStyle}>Otkaži</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', backgroundColor: '#f8fafc', padding: '20px', boxSizing: 'border-box' };
const formCardStyle = { backgroundColor: '#fff', padding: '50px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '800px' };
const titleStyle = { fontSize: '28px', fontWeight: '800', marginBottom: '40px', color: '#1a202c', textAlign: 'center' };
const inputGroupStyle = { marginBottom: '25px' };
const labelStyle = { display: 'block', marginBottom: '10px', fontWeight: '700', color: '#4a5568', fontSize: '16px' };
const inputStyle = { width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fdfdfd' };
const submitButtonStyle = { flex: 2, padding: '16px', backgroundColor: '#4681d8', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' };
const backButtonStyle = { flex: 1, padding: '16px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' };

export default CreateSadrzaj;