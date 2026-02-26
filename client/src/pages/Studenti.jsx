import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Studenti = () => {
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [studenti, setStudenti] = useState([]);
    const [sveGrupe, setSveGrupe] = useState([]);
    
    const [showModal, setShowModal] = useState(false);
    const [showGrupaModal, setShowGrupaModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedGrupaID, setSelectedGrupaID] = useState('');
    const [novaGrupa, setNovaGrupa] = useState({ naziv: '', godina: '' });

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: token } };
            
            const resStudenti = await axios.get(`${API_URL}/student/select`, config);
            setStudenti(resStudenti.data);

            const resGrupe = await axios.get(`${API_URL}/grupa/select`, config);
            setSveGrupe(resGrupe.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setSelectedGrupaID(student.grupaID || '');
        setShowModal(true);
    };

    const handleSaveGrupa = async () => {
        if (!selectedGrupaID) return alert("Izaberite grupu!");
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/student/update-grupa/${selectedStudent.studentID}`, 
                { grupaID: selectedGrupaID },
                { headers: { Authorization: token } }
            );
            alert("Promene su uspešno sačuvane!");
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert("Greška pri čuvanju grupe.");
        }
    };

    const handleCreateGrupa = async () => {
        if (!novaGrupa.naziv || !novaGrupa.godina) return alert("Popunite sva polja!");
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/grupa/create`, {
                naziv: novaGrupa.naziv,
                godina: novaGrupa.godina,
                nastavnikID: user.nastavnikID 
            }, {
                headers: { Authorization: token }
            });

            alert("Grupa uspešno kreirana!");
            setShowGrupaModal(false);
            setNovaGrupa({ naziv: '', godina: '' });
            fetchData(); 
        } catch (err) {
            alert("Greška pri kreiranju grupe.");
        }
    };

    return (
        <div style={layoutStyle}>
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{marginTop: 0}}>
                            {selectedStudent?.grupaID ? 'Izmeni grupu studenta' : 'Dodaj studenta u grupu'}
                        </h3>
                        <p style={{color: '#718096'}}>Student: <strong>{selectedStudent?.ime} {selectedStudent?.prezime}</strong></p>
                        
                        <label style={labelStyle}>Izaberi novu grupu</label>
                        <select 
                            style={inputStyle} 
                            value={selectedGrupaID} 
                            onChange={(e) => setSelectedGrupaID(e.target.value)}
                        >
                            <option value="">Izaberi...</option>
                            {sveGrupe.map(g => (
                                <option key={g.grupaID} value={g.grupaID}>
                                    {g.naziv} ({g.godina}. godina)
                                </option>
                            ))}
                        </select>

                        <div style={{display: 'flex', gap: '15px', marginTop: '25px'}}>
                            <button onClick={handleSaveGrupa} style={confirmButtonStyle}>Sačuvaj</button>
                            <button onClick={() => setShowModal(false)} style={cancelButtonStyle}>Odustani</button>
                        </div>
                    </div>
                </div>
            )}

            {showGrupaModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3 style={{marginTop: 0}}>Kreiraj novu grupu</h3>
                        
                        <label style={labelStyle}>Naziv grupe</label>
                        <input 
                            style={inputStyle}
                            placeholder="Unesite naziv grupe"
                            value={novaGrupa.naziv}
                            onChange={(e) => setNovaGrupa({...novaGrupa, naziv: e.target.value})}
                        />

                        <label style={labelStyle}>Godina</label>
                        <input 
                            style={inputStyle}
                            type="number"
                            placeholder="Unesite godinu"
                            value={novaGrupa.godina}
                            onChange={(e) => setNovaGrupa({...novaGrupa, godina: e.target.value})}
                        />

                        <div style={{display: 'flex', gap: '15px', marginTop: '25px'}}>
                            <button onClick={handleCreateGrupa} style={confirmButtonStyle}>Kreiraj</button>
                            <button onClick={() => setShowGrupaModal(false)} style={cancelButtonStyle}>Odustani</button>
                        </div>
                    </div>
                </div>
            )}

            <aside style={sidebarStyle}>
                <div style={logoAreaStyle}>
                    <div style={logoIconStyle}>CP</div>
                    <h2 style={sidebarTitleStyle}>EduPanel</h2>
                </div>
                <nav>
                    <p style={sectionLabelStyle}>GLAVNI MENI</p>
                    <div onClick={() => navigate('/home')} style={menuItemStyle}>🏠 Dashboard</div>
                    <div onClick={() => navigate('/studenti')} style={{...menuItemStyle, backgroundColor: '#f0f7ff', color: '#3182ce'}}>👥 Studenti</div>
                </nav>
            </aside>

            <main style={mainContentStyle}>
                <header style={headerWrapperStyle}>
                    <h1 style={h1Style}>Upravljanje grupama</h1>
                </header>

                <div style={wideContentCardStyle}>
                    <div style={{...cardHeaderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3 style={cardTitleStyle}>Lista svih studenata</h3>
                        <button onClick={() => setShowGrupaModal(true)} style={createButtonStyle}>+ Kreiraj grupu</button>
                    </div>
                    <div style={tableHeaderStyle}>
                        <span style={{flex: 2}}>IME I PREZIME</span>
                        <span style={{flex: 2}}>USERNAME</span>
                        <span style={{flex: 1}}>GRUPA</span>
                        <span style={{flex: 1, textAlign: 'center'}}>AKCIJA</span>
                    </div>
                    <div style={scrollAreaStyle}>
                        {studenti.map(s => (
                            <div key={s.studentID} style={contentRowStyle}>
                                <span style={{flex: 2, fontWeight: '600'}}>{s.ime} {s.prezime}</span>
                                <span style={{flex: 2}}>{s.username}</span>
                                <span style={{flex: 1}}>{s.nazivGrupe || 'Nema grupu'}</span>
                                <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                                    <button 
                                        onClick={() => handleOpenModal(s)} 
                                        style={s.grupaID ? editButtonStyle : addButtonStyle}
                                    >
                                        {s.grupaID ? '✎ Izmeni grupu' : '+ Dodaj grupu'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

const layoutStyle = { display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#f8fafc' };
const sidebarStyle = { width: '320px', backgroundColor: '#fff', borderRight: '1px solid #e2e8f0', padding: '40px 30px' };
const mainContentStyle = { flex: 1, padding: '60px' };
const wideContentCardStyle = { backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' };
const menuItemStyle = { padding: '15px 20px', borderRadius: '14px', cursor: 'pointer', marginBottom: '10px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '15px' };
const logoAreaStyle = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '60px' };
const logoIconStyle = { width: '50px', height: '50px', backgroundColor: '#4681d8', borderRadius: '15px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '22px' };
const sidebarTitleStyle = { fontSize: '24px', fontWeight: '800' };
const sectionLabelStyle = { fontSize: '13px', fontWeight: '800', color: '#a0aec0', marginBottom: '20px' };
const headerWrapperStyle = { marginBottom: '40px' };
const h1Style = { margin: 0, fontSize: '36px', fontWeight: '800' };
const cardHeaderStyle = { padding: '30px', borderBottom: '1px solid #edf2f7' };
const cardTitleStyle = { margin: 0, fontSize: '22px' };
const tableHeaderStyle = { display: 'flex', padding: '15px 30px', backgroundColor: '#f8fafc', color: '#a0aec0', fontSize: '13px', fontWeight: '800' };
const contentRowStyle = { display: 'flex', padding: '25px 30px', borderBottom: '1px solid #edf2f7', alignItems: 'center' };
const scrollAreaStyle = { maxHeight: '70vh', overflowY: 'auto' };
const addButtonStyle = { padding: '8px 15px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' };
const editButtonStyle = { padding: '8px 15px', backgroundColor: '#edf2f7', color: '#3182ce', border: '1px solid #3182ce', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '24px', width: '400px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '700', marginTop: '20px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', marginBottom: '10px' };
const confirmButtonStyle = { flex: 1, padding: '15px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' };
const cancelButtonStyle = { padding: '15px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' };
const createButtonStyle = { padding: '10px 20px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' };

export default Studenti;