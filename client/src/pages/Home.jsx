import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [projekti, setProjekti] = useState([]);
    const [sadrzaji, setSadrzaji] = useState([]);
    const [predaje, setPredaje] = useState([]);
    const navigate = useNavigate();

    const isStudent = user?.studentID || user?.role === 'student';

    const fetchData = async () => {
        if (!user) return;

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: token } };

        try {
            const currentID = user.studentID;
            const projekatUrl = isStudent 
                ? `http://localhost:5000/api/projekat/${currentID}` 
                : `http://localhost:5000/api/projekat`;
            const resProjekti = await axios.get(projekatUrl, config);
            setProjekti(resProjekti.data);
            
            const resSadrzaj = await axios.get('http://localhost:5000/api/sadrzaj/select', config);
            setSadrzaji(resSadrzaj.data);

            if (!isStudent) {      
                const resPredaje = await axios.get('http://localhost:5000/api/predaja/all', config);
                setPredaje(resPredaje.data);
            }
        } catch (err) {
            console.error("Greška pri učitavanju podataka:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const obrisiProjekat = async (projekatID) => {
        if (window.confirm("Da li ste sigurni da želite da obrišete ovaj projekat?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/projekat/delete/${projekatID}`, {
                    headers: { Authorization: token }
                });
                fetchData(); 
            } catch (err) {
                alert("Greška pri brisanju projekta");
            }
        }
    };

    const handleOceni = async (predajaID) => {
    const ocena = prompt("Unesite ID ocene iz tabele 'ocena':");
    
    if (ocena !== null && ocena.trim() !== "" && !isNaN(ocena)) {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/predaja/oceni/${predajaID}`, 
                { ocenaID: parseInt(ocena) }, 
                { headers: { Authorization: token } }
            );
            alert("Uspešno ocenjeno!");
            fetchData(); 
        } catch (err) {
            alert("Greška: Proverite da li taj ID ocene postoji u bazi.");
        }
    }
};

    return (
        <div style={layoutStyle}>
            
            <aside style={sidebarStyle}>
                <div style={logoAreaStyle}>
                    <div style={logoIconStyle}>CP</div>
                    <h2 style={sidebarTitleStyle}>EduPanel</h2>
                </div>
                
                <p style={sectionLabelStyle}>{isStudent ? "MOJI PROJEKTI" : "STUDENTSKI RADOVI"}</p>
                
                {isStudent && (
                    <button onClick={() => navigate('/create-project')} style={newProjectButtonStyle}>
                        + Novi projekat
                    </button>
                )}

                <div style={projectListContainer}>
                    {projekti.length > 0 ? projekti.map(p => (
                        <div key={p.projekatID} style={sidebarProjectItem}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <div style={fileIconStyle}>📄</div>
                                <span style={projectNameStyle}>{p.naziv}</span>
                            </div>
                            {isStudent && (
                                <button onClick={() => obrisiProjekat(p.projekatID)} style={deleteLinkStyle}>✕</button>
                            )}
                        </div>
                    )) : (
                        <p style={emptyTextStyle}>Nema dostupnih stavki.</p>
                    )}
                </div>
            </aside>

            
            <main style={mainContentStyle}>
                <header style={headerWrapperStyle}>
                    <div style={welcomeTextStyle}>
                        <h1 style={h1Style}>Zdravo, {user?.ime} 👋</h1>
                        <p style={roleBadgeStyle}>
                            Uloga: <span style={{color: '#4681d8'}}>{isStudent ? 'Student' : 'Nastavnik'}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => { localStorage.clear(); window.location.href='/login'; }}
                        style={logoutButtonStyle}
                    >
                        Odjavi se
                    </button>
                </header>

                <div style={dashboardGridStyle}>
                    
                    <section style={{ ...wideContentCardStyle, flex: isStudent ? 1 : 1.5 }}>
                        <div style={cardHeaderStyle}>
                            <h3 style={cardTitleStyle}>Dostupni sadržaji</h3>
                        </div>
                        <div style={tableHeaderStyle}>
                            <span style={{ flex: 2 }}>PREDMET</span>
                            <span style={{ flex: 1, textAlign: 'center' }}>TIP</span>
                        </div>
                        <div style={scrollAreaStyle}>
                            {sadrzaji.map(s => (
                                <div key={s.sadrzajID} style={contentRowStyle}>
                                    <span style={{ flex: 2, fontWeight: '500' }}>{s.naziv}</span>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <span 
                                            onClick={() => isStudent && navigate(`/test/${s.sadrzajID}`)}
                                            style={{
                                                ...typeBadgeStyle, 
                                                cursor: isStudent ? 'pointer' : 'default',
                                                backgroundColor: isStudent ? '#ebf8ff' : '#f7fafc',
                                                border: isStudent ? '1px solid #3182ce' : '1px solid #e2e8f0'
                                            }}
                                        >
                                            {s.tip}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    
                    {!isStudent && (
                        <section style={submissionsPanelStyle}>
                            <div style={cardHeaderStyle}>
                                <h3 style={cardTitleStyle}>Poslednje predaje studenata</h3>
                            </div>
                            <div style={scrollAreaStyle}>
                                {predaje.length > 0 ? predaje.map(p => (
                                    <div key={p.predajaID} style={submissionCardStyle}>
                                        <div style={submissionHeaderStyle}>
                                            <span style={studentNameStyle}>{p.imeStudenta} {p.prezimeStudenta} — {p.vrstaTesta}</span>
                                            <span style={dateStyle}>{new Date(p.datumPredaje).toLocaleDateString()}</span>
                                        </div>
                                        <div style={submissionBodyStyle}>
                                            <p style={{fontSize: '13px', margin: '5px 0', color: '#718096'}}>Sadržaj rada:</p>
                                            <pre style={preTextStyle}>{p.sadrzajRada}</pre>
                                        </div>
                                        <button onClick={() => handleOceni(p.predajaID)} style={gradeButtonStyle}>
                                        {p.ocenaID ? `Ocenjeno: ${p.ocenaID}` : 'Oceni rad'}</button>
                                    </div>
                                )) : (
                                    <p style={{padding: '20px', textAlign: 'center', color: '#a0aec0'}}>Još uvek nema predatih radova.</p>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};


const dashboardGridStyle = { display: 'flex', gap: '24px', flex: 1 };
const h1Style = { margin: 0, fontSize: '28px', color: '#1a202c', fontWeight: '800' };
const logoAreaStyle = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' };
const logoIconStyle = { width: '40px', height: '40px', backgroundColor: '#4681d8', borderRadius: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };
const sectionLabelStyle = { fontSize: '11px', fontWeight: '800', color: '#a0aec0', letterSpacing: '0.1em', marginBottom: '15px' };
const fileIconStyle = { fontSize: '18px' };
const emptyTextStyle = { color: '#a0aec0', fontSize: '13px', textAlign: 'center', marginTop: '20px' };
const scrollAreaStyle = { maxHeight: '60vh', overflowY: 'auto' };
const submissionsPanelStyle = { flex: 1, backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' };
const submissionCardStyle = { padding: '16px', borderBottom: '1px solid #edf2f7', transition: '0.2s hover', ':hover': { backgroundColor: '#f8fafc' } };
const submissionHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' };
const studentNameStyle = { fontWeight: '700', color: '#2d3748', fontSize: '14px' };
const dateStyle = { fontSize: '12px', color: '#a0aec0' };
const submissionBodyStyle = { backgroundColor: '#f7fafc', padding: '12px', borderRadius: '8px', marginBottom: '10px' };
const preTextStyle = { whiteSpace: 'pre-wrap', fontSize: '13px', fontFamily: 'inherit', color: '#4a5568', margin: 0 };
const gradeButtonStyle = { width: '100%', padding: '8px', backgroundColor: '#ebf8ff', color: '#3182ce', border: '1px solid #3182ce', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' };

const layoutStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" };
const sidebarStyle = { width: '280px', backgroundColor: '#fff', borderRight: '1px solid #e2e8f0', padding: '30px 20px' };
const sidebarTitleStyle = { fontSize: '20px', fontWeight: '800', color: '#1a202c', margin: 0 };
const newProjectButtonStyle = { width: '100%', padding: '12px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' };
const projectListContainer = { display: 'flex', flexDirection: 'column' };
const sidebarProjectItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', marginBottom: '5px', backgroundColor: '#f8fafc' };
const projectNameStyle = { fontSize: '14px', color: '#4a5568' };
const deleteLinkStyle = { background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '16px' };
const mainContentStyle = { flex: 1, padding: '40px 50px', display: 'flex', flexDirection: 'column' };
const headerWrapperStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const welcomeTextStyle = { flex: 1 };
const roleBadgeStyle = { color: '#718096', fontSize: '16px', marginTop: '5px', fontWeight: '500' };
const logoutButtonStyle = { padding: '10px 20px', color: '#e53e3e', border: '2px solid #e53e3e', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' };
const wideContentCardStyle = { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' };
const cardHeaderStyle = { padding: '20px 24px', borderBottom: '1px solid #edf2f7' };
const cardTitleStyle = { margin: 0, fontSize: '18px', color: '#2d3748' };
const tableHeaderStyle = { display: 'flex', padding: '12px 24px', backgroundColor: '#f8fafc', color: '#a0aec0', fontSize: '11px', fontWeight: '800' };
const contentRowStyle = { display: 'flex', padding: '18px 24px', borderBottom: '1px solid #edf2f7' };
const typeBadgeStyle = { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' };

export default Home;