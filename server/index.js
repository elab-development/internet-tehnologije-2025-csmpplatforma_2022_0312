require('dotenv').config();
const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile'); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Zahtev stigao: ${req.method} ${req.url}`);
    next();
});

// Inicijalizacija Knex-a
const db = knex(knexConfig.development);


const connectWithRetry = () => {
    db.raw('SELECT 1')
        .then(() => {
            console.log(`Uspešno povezano na MySQL bazu (${process.env.DB_NAME})!`);
        })
        .catch(err => {
            console.log("Greška pri povezivanju na bazu, pokušavam ponovo za 3 sekunde...");
            setTimeout(connectWithRetry, 3000);
        });
};

connectWithRetry();

const studentRoutes = require('./routes/StudentRoutes');
app.use('/api/student', studentRoutes);

const ocenaRoutes = require('./routes/OcenaRoutes');
app.use('/api/ocena', ocenaRoutes);

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

app.get('/', (req, res) => {
    res.send('CSMP Backend Server uspesno pokrenut!');
});

app.listen(PORT, () => {
    console.log(`Server radi na portu: ${PORT}`);
});
