require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Period od 15 minuta
  max: 100, // Maksimalno 100 zahteva po IP adresi u tom periodu
  message: 'Poslali ste previše zahteva sa ove IP adrese. Molimo pokušajte ponovo nakon 15 minuta.',
  standardHeaders: true, 
  legacyHeaders: false, 
})

const app = express();
const PORT = process.env.PORT || 5000;

app.use(limiter);
app.use(helmet());

app.use(cors({
  origin: 'https://frontend-csmp.onrender.com', // Dozvoljavamo samo svom frontendu pristup
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));



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
    console.log(`Swagger dokumentacija dostupna na: http://localhost:${PORT}/api-docs`);
});