import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [projekti, setProjekti] = useState([]);
    const [sadrzaji, setSadrzaji] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        const currentID = user?.studentID || user?.id;
        if (!user || !currentID) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: token } };
            const isStudent = user.studentID || user.role === 'student';

            const projekatUrl = isStudent 
                ? `http://localhost:5000/api/projekat/${currentID}` 
                : `http://localhost:5000/api/projekat`;

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
                <h2 style={sidebarTitleStyle}>Moji projekti</h2>
                
                {isStudent && (
                    <button onClick={() => navigate('/create-project')} style={newProjectButtonStyle}>
                        + Novi projekat
                    </button>
                )}

                <div style={projectListContainer}>
                    {projekti.length > 0 ? projekti.map(p => (
                        <div key={p.projekatID} style={sidebarProjectItem}>
                            <span style={projectNameStyle}>{p.naziv}</span>
                            <button 
                                onClick={() => obrisiProjekat(p.projekatID)} 
                                style={deleteLinkStyle}
                            >
                                Obriši
                            </button>
                        </div>
                    )) : <p style={{color: '#999', fontSize: '14px'}}>Nema projekata.</p>}
                </div>
            </aside>

            {/* DESNA STRANA - GLAVNI SADRŽAJ */}
            <main style={mainContentStyle}>
                <header style={headerStyle}>
                    <div>
                        <h1 style={{ margin: 0, color: '#333' }}>Dobrodošli, {user?.ime}</h1>
                        <p style={{ color: '#666', marginTop: '5px' }}>
                            Uloga: <span style={{fontWeight: '600', color: '#4681d8'}}>{isStudent ? 'Student' : 'Administrator'}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => { localStorage.clear(); window.location.href='/login'; }}
                        style={logoutButtonStyle}
                    >
                        Odjavi se
                    </button>
                </header>

                <section style={contentCardStyle}>
                    <h3 style={sectionTitleStyle}>
                        {isStudent ? 'Zadaci i Testovi za polaganje' : 'Upravljanje nastavnim materijalom'}
                    </h3>
                    <div style={tableHeaderStyle}>
                        <span>Naziv aktivnosti</span>
                        <span>Akcija</span>
                    </div>
                    {sadrzaji.map(s => (
                        <div key={s.sadrzajID} style={contentRowStyle}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div style={bulletStyle}></div>
                                <span>{s.naziv} <small style={typeBadgeStyle}>{s.tip}</small></span>
                            </div>
                            <button style={actionButtonStyle}>
                                {isStudent ? 'Predaj rad' : 'Pregledaj'}
                            </button>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};



const layoutStyle = { 
    display: 'flex', 
    minHeight: '100vh', 
    backgroundColor: '#f8fafd',
    fontFamily: "'Segoe UI', Roboto, sans-serif"
};

const sidebarStyle = { 
    width: '320px', 
    backgroundColor: '#ffffff', 
    borderRight: '1px solid #e1e8ed', 
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 5px rgba(0,0,0,0.02)'
};

const sidebarTitleStyle = {
    fontSize: '22px',
    color: '#1a1a1a',
    marginBottom: '20px',
    fontWeight: '700'
};

const newProjectButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '25px',
    transition: 'background 0.2s'
};

const projectListContainer = {
    flex: 1,
    overflowY: 'auto'
};

const sidebarProjectItem = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 10px',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background 0.2s',
    borderRadius: '6px'
};

const projectNameStyle = {
    fontSize: '15px',
    color: '#444',
    fontWeight: '500'
};

const deleteLinkStyle = {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
};

const mainContentStyle = { 
    flex: 1, 
    padding: '40px 60px' 
};

const headerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '2px solid #edf2f7'
};

const logoutButtonStyle = { 
    padding: '10px 20px', 
    backgroundColor: '#fff', 
    color: '#dc3545', 
    border: '1px solid #dc3545', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontWeight: '600'
};

const contentCardStyle = { 
    backgroundColor: '#fff', 
    padding: '30px', 
    borderRadius: '12px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
    width: '100%'
};

const sectionTitleStyle = {
    fontSize: '20px',
    marginBottom: '25px',
    color: '#2d3748'
};

const tableHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    backgroundColor: '#f7fafc',
    borderRadius: '6px',
    fontWeight: '600',
    color: '#718096',
    fontSize: '14px',
    marginBottom: '10px'
};

const contentRowStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '18px 15px', 
    borderBottom: '1px solid #edf2f7' 
};

const bulletStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: '#4681d8',
    borderRadius: '50%',
    marginRight: '12px'
};

const typeBadgeStyle = {
    marginLeft: '10px',
    padding: '2px 8px',
    backgroundColor: '#ebf4ff',
    color: '#4681d8',
    borderRadius: '4px',
    fontSize: '11px',
    textTransform: 'uppercase'
};

const actionButtonStyle = { 
    backgroundColor: '#4681d8', 
    color: 'white', 
    border: 'none', 
    padding: '8px 16px', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontWeight: '600',
    fontSize: '13px'
};

export default Home;