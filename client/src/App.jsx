import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminHome from './pages/AdminHome';
import RegistracijaN from './pages/RegistracijaN';
import CreateProject from './pages/CreateProject';
import Home from './pages/Home';
import TestStranica from './pages/TestStranica';
import MojiRadovi from './pages/MojiRadovi';
import CreateSadrzaj from './pages/CreateSadrzaj';
import Studenti from './pages/Studenti';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/login" element={<Login />} />
          
          
          <Route path="/register" element={<Register />} />

          
          <Route path="/" element={<Navigate to="/login" />} />
          
          
          <Route path="/AdminHome" element={<AdminHome />} />

          <Route path="/registerN" element={<RegistracijaN />} />

          <Route path="/create-project" element={<CreateProject />} />

          <Route path="/home" element={<Home />} />

          <Route path="/test/:sadrzajID" element={<TestStranica />} />

          <Route path="/moji-radovi" element={<MojiRadovi />} />

          <Route path="/create-content" element={<CreateSadrzaj />} />

          <Route path="/studenti" element={<Studenti />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
