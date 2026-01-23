import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [projekti, setProjekti] = useState([]);
    const [sadrzaji, setSadrzaji] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
    if (!user) return;

    console.log("Trenutni user objekat iz konzole:", user);
    
    const isStudentUser = user.studentID !== undefined && user.studentID !== null; 
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: token } };

    try {
        
        const currentID = user.studentID;

        const projekatUrl = isStudentUser 
            ? `http://localhost:5000/api/projekat/${currentID}` 
            : `http://localhost:5000/api/projekat`;

        console.log("Finalni URL koji šaljem:", projekatUrl);

        const resProjekti = await axios.get(projekatUrl, config);
        setProjekti(resProjekti.data);
        
        const resSadrzaj = await axios.get('http://localhost:5000/api/sadrzaj/select', config);
        setSadrzaji(resSadrzaj.data);
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

    const isStudent = user?.studentID || user?.role === 'student';

    

    return (
        <div style={layoutStyle}>
            
            <aside style={sidebarStyle}>
                <h2 style={sidebarTitleStyle}>
                {isStudent ? "Moji projekti" : "Studentski projekti"}
                </h2>
                
                {isStudent && (
                <button onClick={() => navigate('/create-project')} style={newProjectButtonStyle}>
                + Novi projekat
                </button>
                )}

                <div style={projectListContainer}>
                {projekti.length > 0 ? projekti.map(p => (
                <div key={p.projekatID} style={sidebarProjectItem}>
                <span style={projectNameStyle}>{p.naziv}</span>
                
                {isStudent && (
                    <button onClick={() => obrisiProjekat(p.projekatID)} style={deleteLinkStyle}>
                        Obriši
                    </button>
                )}
            </div>
        )) : (
            <p style={{color: '#999', fontSize: '14px'}}>
                {isStudent ? "Nemaš kreiranih projekata." : "Trenutno nema studentskih projekata."}
            </p>
        )}
    </div>
</aside>

            
            <main style={mainContentStyle}>
                <header style={headerWrapperStyle}>
                    <div style={welcomeTextStyle}>
                        <h1 style={{ margin: 0, fontSize: '32px', color: '#1a202c' }}>Dobrodošli, {user?.ime}</h1>
                        <p style={{ color: '#718096', fontSize: '18px', marginTop: '8px' }}>
                            Uloga: <span style={{fontWeight: '600', color: '#4681d8'}}>{isStudent ? 'Student' : 'Nastavnik'}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => { localStorage.clear(); window.location.href='/login'; }}
                        style={logoutButtonStyle}
                    >
                        Odjavi se
                    </button>
                </header>

                
                <section style={wideContentCardStyle}>
                    <div style={cardHeaderStyle}>
                        <h3 style={{ margin: 0, color: '#2d3748' }}>
                            {isStudent ? 'Aktivni zadaci i nastavni materijali' : 'Pregled svih sadržaja'}
                        </h3>
                    </div>

                    <div style={tableHeaderStyle}>
                        <span style={{ flex: 2 }}>NAZIV AKTIVNOSTI</span>
                        <span style={{ flex: 1, textAlign: 'center' }}>TIP</span>
                        <span style={{ flex: 1, textAlign: 'right' }}>AKCIJA</span>
                    </div>

                    {sadrzaji.length > 0 ? sadrzaji.map(s => (
                        <div key={s.sadrzajID} style={contentRowStyle}>
                            <div style={{ flex: 2, display: 'flex', alignItems: 'center' }}>
                                <div style={bulletStyle}></div>
                                <span style={{ fontWeight: '500', color: '#4a5568' }}>{s.naziv}</span>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <span style={typeBadgeStyle}>{s.tip}</span>
                            </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <button style={actionButtonStyle}>
                                    {isStudent ? 'Predaj rad' : 'Pregledaj'}
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#a0aec0' }}>
                            Trenutno nema dostupnih zadataka.
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};



const layoutStyle = { 
    display: 'flex', 
    minHeight: '100vh', 
    backgroundColor: '#f7fafc',
    fontFamily: "'Inter', sans-serif"
};

const sidebarStyle = { 
    width: '300px', 
    minWidth: '300px',
    backgroundColor: '#ffffff', 
    borderRight: '1px solid #e2e8f0', 
    padding: '40px 24px',
    display: 'flex',
    flexDirection: 'column'
};

const sidebarTitleStyle = { fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#1a202c' };

const newProjectButtonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#38a169',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '30px',
    fontSize: '16px'
};

const projectListContainer = { flex: 1, overflowY: 'auto' };

const sidebarProjectItem = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid #edf2f7'
};

const projectNameStyle = { fontSize: '15px', color: '#4a5568', fontWeight: '500' };

const deleteLinkStyle = { background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: '600' };

const mainContentStyle = { 
    flex: 1, 
    padding: '60px 40px', 
    backgroundColor: '#f7fafc',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
};
const headerWrapperStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '50px' 
};

const welcomeTextStyle = { flex: 1 };

const logoutButtonStyle = { 
    padding: '12px 24px', 
    backgroundColor: 'transparent', 
    color: '#e53e3e', 
    border: '2px solid #e53e3e', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontWeight: '700'
};

const wideContentCardStyle = { 
    backgroundColor: '#ffffff', 
    borderRadius: '16px', 
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    width: '100%',   
    marginTop: '20px'
};

const cardHeaderStyle = { padding: '24px 32px', borderBottom: '1px solid #edf2f7', backgroundColor: '#fff' };

const tableHeaderStyle = {
    display: 'flex',
    padding: '14px 32px',
    backgroundColor: '#f8fafc',
    color: '#718096',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.05em'
};

const contentRowStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    padding: '24px 32px', 
    borderBottom: '1px solid #edf2f7',
    transition: 'background 0.2s'
};

const bulletStyle = { width: '10px', height: '10px', backgroundColor: '#4299e1', borderRadius: '50%', marginRight: '16px' };

const typeBadgeStyle = {
    padding: '4px 12px',
    backgroundColor: '#ebf8ff',
    color: '#3182ce',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase'
};

const actionButtonStyle = { 
    backgroundColor: '#4299e1', 
    color: 'white', 
    border: 'none', 
    padding: '10px 24px', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: '60'
};

export default Home;