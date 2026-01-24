import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestStranica = () => {
    const { sadrzajID } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [pitanjaLista, setPitanjaLista] = useState([]);
    const [odgovoriPoPitanjima, setOdgovoriPoPitanjima] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/sadrzaj/select?id=${sadrzajID}`, {
                    headers: { Authorization: token }
                });
                
                const podaci = Array.isArray(res.data) ? res.data[0] : res.data;

                if (podaci) {
                    setTest(podaci);

                    
                    if (podaci.pitanje) {
                        const delovi = podaci.pitanje.split(/(?=\d+\.\s+)/).filter(p => p.trim() !== "");
                        setPitanjaLista(delovi);
                        
                        const inicijalniOdgovori = {};
                        delovi.forEach((_, index) => {
                            inicijalniOdgovori[index] = "";
                        });
                        setOdgovoriPoPitanjima(inicijalniOdgovori);
                    }
                }
            } catch (err) {
                console.error("Greška pri učitavanju testa:", err);
            }
        };
        fetchTest();
    }, [sadrzajID]);

    const handlePromenaOdgovora = (index, vrednost) => {
        setOdgovoriPoPitanjima(prev => ({
            ...prev,
            [index]: vrednost
        }));
    };

    const handlePredaj = async () => {
    
    const numerisaniOdgovori = pitanjaLista.map((_, index) => {
        const odgovor = odgovoriPoPitanjima[index] || ""; 
        return `${index + 1}. ${odgovor.trim()}`; 
    }).join('\n'); 

    try {
        const token = localStorage.getItem('token');
        const podaciZaSlanje = {
            studentID: user.studentID,
            sadrzajID: sadrzajID,
            sadrzajRada: numerisaniOdgovori 
        };

        await axios.post('http://localhost:5000/api/predaja/submit', podaciZaSlanje, {
            headers: { Authorization: token }
        });

        alert("Uspešno predat rad!");
        navigate('/home');
    } catch (err) {
        alert("Greška pri predaji rada.");
    }
};

    if (!test) {
        return <div style={{padding: '50px', textAlign: 'center'}}>Učitavanje podataka iz baze...</div>;
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <header style={headerStyle}>
                    <h1 style={titleStyle}>{test.naziv}</h1>
                    <div style={infoBoxStyle}>
                        <span><strong>Tip:</strong> {test.tip}</span>
                        <span><strong>Maksimalno poena:</strong> {test.maxPoena}</span>
                    </div>
                </header>

                <div style={questionsContainerStyle}>
                    {pitanjaLista.length > 0 ? pitanjaLista.map((pitanje, index) => (
                        <div key={index} style={pitanjeBlokStyle}>
                            <div style={tekstPitanjaStyle}>
                                <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, fontSize: '16px'}}>
                                    {pitanje.trim()}
                                </pre>
                            </div>
                            <textarea
                                style={textareaStyle}
                                placeholder="Unesite vaš odgovor ovde..."
                                value={odgovoriPoPitanjima[index]}
                                onChange={(e) => handlePromenaOdgovora(index, e.target.value)}
                            />
                        </div>
                    )) : (
                        <p style={{textAlign: 'center', color: '#718096'}}>Nema definisanih pitanja za ovaj sadržaj.</p>
                    )}
                </div>

                <footer style={footerStyle}>
                    <button onClick={() => navigate('/home')} style={cancelButtonStyle}>Odustani</button>
                    <button onClick={handlePredaj} style={submitButtonStyle}>Predaj rad</button>
                </footer>
            </div>
        </div>
    );
};

// --- STILOVI ---
const containerStyle = { padding: '40px 20px', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center' };
const cardStyle = { backgroundColor: '#fff', maxWidth: '850px', width: '100%', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', padding: '40px' };
const headerStyle = { borderBottom: '2px solid #f0f2f5', marginBottom: '30px', paddingBottom: '20px' };
const titleStyle = { margin: 0, color: '#1a202c', fontSize: '28px' };
const infoBoxStyle = { marginTop: '10px', display: 'flex', gap: '30px', color: '#4a5568', fontSize: '16px' };
const questionsContainerStyle = { display: 'flex', flexDirection: 'column', gap: '30px' };
const pitanjeBlokStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const tekstPitanjaStyle = { backgroundColor: '#ebf8ff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #3182ce', color: '#2c5282', fontWeight: '500' };
const textareaStyle = { width: '100%', minHeight: '120px', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '15px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' };
const footerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px', borderTop: '1px solid #f0f2f5', paddingTop: '20px' };
const cancelButtonStyle = { padding: '12px 25px', backgroundColor: '#edf2f7', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#4a5568' };
const submitButtonStyle = { padding: '12px 35px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' };

export default TestStranica;