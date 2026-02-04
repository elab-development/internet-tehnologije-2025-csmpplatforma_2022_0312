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
        const formatiraniOdgovori = pitanjaLista.map((pitanjeTekst, index) => {
            const odgovor = odgovoriPoPitanjima[index] || ""; 
            const cistoPitanje = pitanjeTekst.replace(/^\d+\.\s*/, '').trim();
            
            return `PITANJE ${index + 1}: ${cistoPitanje}\n-> ODGOVOR: ${odgovor.trim() ? odgovor.trim() : 'Nema odgovora'}`; 
        }).join('\n\n-----------------------------------\n\n'); 

        try {
            const token = localStorage.getItem('token');
            const podaciZaSlanje = {
                studentID: user.studentID,
                sadrzajID: sadrzajID,
                tekst: formatiraniOdgovori,
                odgovor: formatiraniOdgovori,
                sadrzajRada: formatiraniOdgovori
            };

            await axios.post('http://localhost:5000/api/predaja/submit', podaciZaSlanje, {
                headers: { Authorization: token }
            });

            alert("Uspešno predat rad!");
            navigate('/home');
        } catch (err) {
            console.error(err);
            alert("Greška pri predaji rada.");
        }
    };

    if (!test) {
        return <div style={{padding: '50px', textAlign: 'center', fontSize: '20px'}}>Učitavanje podataka iz baze...</div>;
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <header style={headerStyle}>
                    <h1 style={titleStyle}>{test.naziv}</h1>
                    <div style={infoBoxStyle}>
                        <span style={badgeStyle}><strong>Tip:</strong> {test.tip}</span>
                        <span style={badgeStyle}><strong>Maksimalno poena:</strong> {test.maxPoena}</span>
                    </div>
                </header>

                <div style={questionsContainerStyle}>
                    {pitanjaLista.length > 0 ? pitanjaLista.map((pitanje, index) => (
                        <div key={index} style={pitanjeBlokStyle}>
                            <div style={tekstPitanjaStyle}>
                                <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, fontSize: '18px', fontWeight: '600'}}>
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
                        <p style={{textAlign: 'center', color: '#718096', fontSize: '18px'}}>Nema definisanih pitanja za ovaj sadržaj.</p>
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

const containerStyle = { 
    padding: '60px 0', 
    backgroundColor: '#f8fafc', 
    minHeight: '100vh', 
    width: '100vw', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center' 
};

const cardStyle = { 
    backgroundColor: '#fff', 
    width: '90%',           
    maxWidth: '1200px',     
    borderRadius: '24px', 
    boxShadow: '0 10px 40px rgba(0,0,0,0.06)', 
    padding: '50px' 
};

const headerStyle = { 
    borderBottom: '2px solid #f1f5f9', 
    marginBottom: '40px', 
    paddingBottom: '30px' 
};

const titleStyle = { 
    margin: 0, 
    color: '#1a202c', 
    fontSize: '36px',       
    fontWeight: '800'
};

const infoBoxStyle = { 
    marginTop: '20px', 
    display: 'flex', 
    gap: '20px', 
    color: '#64748b'
};

const badgeStyle = {
    backgroundColor: '#f1f5f9',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '16px'
};

const questionsContainerStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '40px' 
};

const pitanjeBlokStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
};

const tekstPitanjaStyle = { 
    backgroundColor: '#f0f7ff', 
    padding: '25px', 
    borderRadius: '16px', 
    borderLeft: '6px solid #3182ce', 
    color: '#1e40af'
};

const textareaStyle = { 
    width: '100%', 
    minHeight: '150px', 
    padding: '20px', 
    borderRadius: '16px', 
    border: '2px solid #e2e8f0', 
    fontSize: '17px', 
    outline: 'none', 
    resize: 'vertical', 
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
};

const footerStyle = { 
    display: 'flex', 
    justifyContent: 'flex-end', 
    gap: '20px', 
    marginTop: '50px', 
    borderTop: '2px solid #f1f5f9', 
    paddingTop: '30px' 
};

const cancelButtonStyle = { 
    padding: '15px 35px', 
    backgroundColor: '#f1f5f9', 
    border: 'none', 
    borderRadius: '14px', 
    cursor: 'pointer', 
    fontWeight: '700', 
    color: '#64748b',
    fontSize: '16px'
};

const submitButtonStyle = { 
    padding: '15px 50px', 
    backgroundColor: '#3182ce', 
    color: 'white', 
    border: 'none', 
    borderRadius: '14px', 
    cursor: 'pointer', 
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)'
};

export default TestStranica;