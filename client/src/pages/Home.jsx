import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [projekti, setProjekti] = useState([]);
    const [sadrzaji, setSadrzaji] = useState([]);
    const [predaje, setPredaje] = useState([]);

    const [searchNaziv, setSearchNaziv] = useState('');
    const [searchTip, setSearchTip] = useState('');
    const [tipoviIzBaze, setTipoviIzBaze] = useState([]);

    const [searchStudent, setSearchStudent] = useState('');
    const [searchPredmet, setSearchPredmet] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [selectedPredajaID, setSelectedPredajaID] = useState(null);
    const [ocenaInput, setOcenaInput] = useState('');
    const [komentarInput, setKomentarInput] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const isStudent = user?.studentID || user?.role === 'student';

    const fetchData = async () => {
        if (!user) return;
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: token },
            params: { naziv: searchNaziv, tip: searchTip }
        };

        try {
            const currentID = user.studentID;
            const projekatUrl = isStudent
                ? `http://localhost:5000/api/projekat/${currentID}`
                : `http://localhost:5000/api/projekat`;
            
            const resProjekti = await axios.get(projekatUrl, config);
            setProjekti(resProjekti.data);

            const resSadrzaj = await axios.get('http://localhost:5000/api/sadrzaj/select', config);
            setSadrzaji(resSadrzaj.data);

            try {
                const resSviTipovi = await axios.get('http://localhost:5000/api/sadrzaj/tipovi', {
                    headers: { Authorization: token }
                });
                const unikatni = Array.isArray(resSviTipovi.data) 
                    ? [...new Set(resSviTipovi.data.map(item => typeof item === 'string' ? item : item.tip))]
                    : [];
                setTipoviIzBaze(unikatni);
            } catch (e) {
                console.error("Greška kod tipova:", e);
            }

            if (!isStudent) {      
                const resPredaje = await axios.get('http://localhost:5000/api/predaja/all', config);
                setPredaje(resPredaje.data);
            }
        } catch (err) { 
            console.error("Generalna greška pri dovlačenju podataka:", err); 
        }
    };

    useEffect(() => {
        fetchData();
    }, [user, searchNaziv, searchTip]);

    const filtriranePredaje = predaje.filter(p => {
        const punoIme = `${p.imeStudenta} ${p.prezimeStudenta}`.toLowerCase();
        const predmet = (p.vrstaTesta || "").toLowerCase();
        return punoIme.includes(searchStudent.toLowerCase()) && 
               predmet.includes(searchPredmet.toLowerCase());
    });

    const handlePotvrdiOcenu = async () => {
        if (!ocenaInput) return alert("Unesite ocenu!");
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: token } };
            const resOcena = await axios.post('http://localhost:5000/api/ocena', {
                vrednost: parseInt(ocenaInput),
                komentar: komentarInput
            }, config);
            const noviID = resOcena.data.ocenaID;
            await axios.put(`http://localhost:5000/api/predaja/oceni/${selectedPredajaID}`, { ocenaID: noviID }, config);
            alert("Uspešno ocenjeno!");
            setShowModal(false);
            setOcenaInput(''); setKomentarInput('');
            fetchData();
        } catch (err) { alert("Greška pri unosu ocene."); }
    };

    return (
        <div style={layoutStyle}>
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{marginTop: 0, fontSize: '22px'}}>Oceni rad</h3>
                        <label style={labelStyle}>Ocena (5-10)</label>
                        <input type="number" style={inputStyle} value={ocenaInput} onChange={(e) => setOcenaInput(e.target.value)} />
                        <label style={{...labelStyle, marginTop: '15px'}}>Komentar</label>
                        <textarea style={{...inputStyle, height: '100px'}} value={komentarInput} onChange={(e) => setKomentarInput(e.target.value)} />
                        <div style={{display: 'flex', gap: '15px', marginTop: '25px'}}>
                            <button onClick={handlePotvrdiOcenu} style={confirmButtonStyle}>Sačuvaj</button>
                            <button onClick={() => setShowModal(false)} style={cancelButtonStyle}>Odustani</button>
                        </div>
                    </div>
                </div>
            )}

            <aside style={sidebarStyle}>
                <div style={logoAreaStyle}>
                    <div style={logoIconStyle}>CP</div>
                    <h2 style={sidebarTitleStyle}>EduPanel</h2>
                </div>
                
                <nav style={{ marginBottom: '40px' }}>
                    <p style={sectionLabelStyle}>GLAVNI MENI</p>
                    <div onClick={() => navigate('/home')} style={{...menuItemStyle, backgroundColor: location.pathname === '/home' ? '#f0f7ff' : 'transparent', color: location.pathname === '/home' ? '#3182ce' : '#4a5568'}}>
                        🏠 Dashboard
                    </div>
                    {!isStudent && (
                        <div onClick={() => navigate('/studenti')} style={{...menuItemStyle, backgroundColor: location.pathname === '/studenti' ? '#f0f7ff' : 'transparent', color: location.pathname === '/studenti' ? '#3182ce' : '#4a5568'}}>
                            👥 Studenti
                        </div>
                    )}
                    {isStudent && (
                        <div onClick={() => navigate('/moji-radovi')} style={{...menuItemStyle, backgroundColor: location.pathname === '/moji-radovi' ? '#f0f7ff' : 'transparent', color: location.pathname === '/moji-radovi' ? '#3182ce' : '#4a5568'}}>
                            📁 Moji predati radovi
                        </div>
                    )}
                </nav>

                <p style={sectionLabelStyle}>{isStudent ? "MOJI PROJEKTI" : "STUDENTSKI RADOVI"}</p>
                
                {isStudent && (
                    <button onClick={() => navigate('/create-project')} style={newProjectButtonStyle}>+ Novi projekat</button>
                )}

                <div style={projectListContainer}>
                    {projekti.map(p => (
                        <div key={p.projekatID} style={sidebarProjectItem}>📄 {p.naziv}</div>
                    ))}
                </div>
            </aside>

            <main style={mainContentStyle}>
                <header style={headerWrapperStyle}>
                    <div>
                        <h1 style={h1Style}>Zdravo, {user?.ime} 👋</h1>
                        <p style={roleBadgeStyle}>Uloga: <span style={{color: '#4681d8'}}>{isStudent ? 'Student' : 'Nastavnik'}</span></p>
                    </div>
                    <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} style={logoutButtonStyle}>Odjavi se</button>
                </header>

                <div style={dashboardGridStyle}>
                    <section style={wideContentCardStyle}>
                        
                        <div style={{...cardHeaderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h3 style={cardTitleStyle}>Dostupni sadržaji</h3>
                            {!isStudent && (
                                <button 
                                    onClick={() => navigate('/create-content')} 
                                    style={inlineAddButtonStyle}
                                >
                                    + Novi sadržaj
                                </button>
                            )}
                        </div>
                        
                        <div style={searchContainerStyle}>
                            <input
                                type="text"
                                placeholder="Pretraži po nazivu..."
                                style={smallInputStyle}
                                value={searchNaziv}
                                onChange={(e) => setSearchNaziv(e.target.value)}
                            />
                            <select
                                style={smallInputStyle}
                                value={searchTip}
                                onChange={(e) => setSearchTip(e.target.value)}
                            >
                                <option value="">Svi tipovi</option>
                                {tipoviIzBaze.map((tip, index) => (
                                    <option key={index} value={tip}>{tip}</option>
                                ))}
                            </select>
                        </div>

                        <div style={tableHeaderStyle}>
                            <span style={{flex: 3}}>PREDMET</span>
                            <span style={{flex: 1, textAlign: 'center'}}>TIP</span>
                        </div>
                        <div style={scrollAreaStyle}>
                            {sadrzaji.length > 0 ? sadrzaji.map(s => (
                                <div key={s.sadrzajID} style={contentRowStyle}>
                                    <span style={{flex: 3, fontWeight: '600', fontSize: '18px'}}>{s.naziv}</span>
                                    <span style={typeBadgeStyle} onClick={() => isStudent && navigate(`/test/${s.sadrzajID}`)}>{s.tip}</span>
                                </div>
                            )) : (
                                <p style={{textAlign: 'center', padding: '30px', color: '#a0aec0'}}>Nema pronađenih sadržaja.</p>
                            )}
                        </div>
                    </section>

                    {!isStudent && (
                        <section style={submissionsPanelStyle}>
                            <div style={cardHeaderStyle}><h3 style={cardTitleStyle}>Poslednje predaje</h3></div>
                            
                            <div style={{...searchContainerStyle, flexDirection: 'column', padding: '20px 30px'}}>
                                <input 
                                    type="text" 
                                    placeholder="Pretraži studenta..." 
                                    style={smallInputStyle} 
                                    value={searchStudent}
                                    onChange={(e) => setSearchStudent(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Pretraži po predmetu..." 
                                    style={{...smallInputStyle, marginTop: '10px'}} 
                                    value={searchPredmet}
                                    onChange={(e) => setSearchPredmet(e.target.value)}
                                />
                            </div>

                            <div style={scrollAreaStyle}>
                                {filtriranePredaje.map(p => (
                                    <div key={p.predajaID} style={submissionCardStyle}>
                                        <div style={submissionHeaderStyle}>
                                            <span style={studentNameStyle}>{p.imeStudenta} {p.prezimeStudenta}</span>
                                            <span style={dateStyle}>{new Date(p.datumPredaje).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{marginBottom: '10px', color: '#718096'}}>{p.vrstaTesta}</div>
                                        <div style={submissionBodyStyle}><pre style={preTextStyle}>{p.sadrzajRada}</pre></div>
                                        
                                        {p.ocenaID > 0 ? (
                                            <div style={ocenaBoxStyle}><strong>Ocena: {p.vrednost}</strong></div>
                                        ) : (
                                            <button onClick={() => {setSelectedPredajaID(p.predajaID); setShowModal(true);}} style={gradeButtonStyle}>Oceni rad</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};


const inlineAddButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4681d8',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.2s'
};

const layoutStyle = { display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#f8fafc', margin: 0 };
const sidebarStyle = { width: '320px', backgroundColor: '#fff', borderRight: '1px solid #e2e8f0', padding: '40px 30px' };
const mainContentStyle = { flex: 1, padding: '60px', maxWidth: 'calc(100vw - 320px)' };
const dashboardGridStyle = { display: 'flex', gap: '40px', width: '100%' };
const wideContentCardStyle = { flex: 2, backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' };
const submissionsPanelStyle = { flex: 1.3, backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const searchContainerStyle = { display: 'flex', gap: '15px', padding: '0 30px 20px 30px', borderBottom: '1px solid #edf2f7' };
const smallInputStyle = { padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', flex: 1, backgroundColor: '#f8fafc' };
const menuItemStyle = { padding: '15px 20px', borderRadius: '14px', cursor: 'pointer', marginBottom: '10px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '15px' };
const logoAreaStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '60px' };
const logoIconStyle = { width: '50px', height: '50px', backgroundColor: '#4681d8', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '22px' };
const sidebarTitleStyle = { fontSize: '24px', fontWeight: '800' };
const sectionLabelStyle = { fontSize: '13px', fontWeight: '800', color: '#a0aec0', marginBottom: '20px' };
const newProjectButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', marginBottom: '30px' };
const sidebarProjectItem = { padding: '18px', borderRadius: '14px', backgroundColor: '#f8fafc', fontSize: '16px', marginBottom: '10px' };
const headerWrapperStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' };
const h1Style = { margin: 0, fontSize: '36px', fontWeight: '800' };
const roleBadgeStyle = { fontSize: '20px', color: '#718096', marginTop: '10px' };
const logoutButtonStyle = { padding: '12px 30px', color: '#e53e3e', border: '2px solid #e53e3e', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' };
const cardHeaderStyle = { padding: '30px', borderBottom: '1px solid #edf2f7' };
const cardTitleStyle = { margin: 0, fontSize: '22px' };
const tableHeaderStyle = { display: 'flex', padding: '15px 30px', backgroundColor: '#f8fafc', color: '#a0aec0', fontSize: '13px', fontWeight: '800' };
const contentRowStyle = { display: 'flex', padding: '25px 30px', borderBottom: '1px solid #edf2f7', alignItems: 'center' };
const typeBadgeStyle = { padding: '8px 20px', backgroundColor: '#ebf8ff', color: '#3182ce', borderRadius: '18px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' };
const scrollAreaStyle = { maxHeight: '70vh', overflowY: 'auto' };
const submissionCardStyle = { padding: '25px', borderBottom: '1px solid #edf2f7' };
const submissionHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' };
const studentNameStyle = { fontWeight: '700', fontSize: '18px' };
const dateStyle = { fontSize: '14px', color: '#a0aec0' };
const submissionBodyStyle = { backgroundColor: '#f7fafc', padding: '20px', borderRadius: '14px', marginBottom: '20px' };
const preTextStyle = { whiteSpace: 'pre-wrap', fontSize: '15px', margin: 0 };
const gradeButtonStyle = { width: '100%', padding: '15px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' };
const ocenaBoxStyle = { backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', padding: '15px', borderRadius: '12px', color: '#2f855a', textAlign: 'center' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', width: '450px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '700' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', boxSizing: 'border-box' };
const confirmButtonStyle = { flex: 1, padding: '15px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700' };
const cancelButtonStyle = { padding: '15px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '12px', fontWeight: '700' };
const projectListContainer = { display: 'flex', flexDirection: 'column' };

export default Home;