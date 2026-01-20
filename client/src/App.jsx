import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminHome from './pages/AdminHome';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Kada korisnik ode na /login, prikaži Login komponentu */}
          <Route path="/login" element={<Login />} />
          
          {/* Kada korisnik ode na /register, prikaži Register komponentu */}
          <Route path="/register" element={<Register />} />

          {/* Ako neko uđe na običan localhost:5173, automatski ga pošalji na /login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Ovde ćemo kasnije dodati Dashboard stranicu */}
          <Route path="/AdminHome" element={<AdminHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
