const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

// Test konekcije
db.getConnection()
  .then(() => console.log("Uspešno povezano na MySQL bazu (port 3307)!"))
  .catch(err => console.log("Greška pri povezivanju na bazu: ", err));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const studentRoutes = require('./routes/StudentRoutes');
app.use('/api/student', studentRoutes);

const ocenaRoutes = require('./routes/OcenaRoutes');
app.use('/api/ocena',ocenaRoutes);

const nastavnikRoutes = require('./routes/NastavnikRoutes');
app.use('/api/nastavnik', nastavnikRoutes);

const sadrzajRoutes = require('./routes/SadrzajRoutes');
app.use('/api/sadrzaj', sadrzajRoutes);

const grupaRoutes = require('./routes/GrupaRoutes');
app.use('/api/grupa', grupaRoutes);

const predajaRoutes = require('./routes/PredajaRoutes');
app.use('/api/predaja', predajaRoutes);

const projekatRoutes = require('./routes/ProjekatRoutes');
app.use('/api/projekat', projekatRoutes);

const authRoutes = require('./routes/AuthRoutes');
app.use('/api/auth', authRoutes);

// Osnovna ruta (da proverimo da li radi)
app.get('/', (req, res) => {
    res.send('CSMP Backend Server uspesno pokrenut!');
});

app.listen(PORT, () => {
    console.log(`Server radi na portu: ${PORT}`);
});

