require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 500,
  message: 'Poslali ste previše zahteva sa ove IP adrese. Molimo pokušajte ponovo nakon 15 minuta.',
  standardHeaders: true, 
  legacyHeaders: false, 
})

const PORT = process.env.PORT || 5000;

app.use(limiter);
app.use(helmet());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

if (process.env.NODE_ENV === 'production') {
    db.migrate.latest()
        .then(() => {
            console.log('Migracije su uspešno izvršene!');
          
            return db.seed.run(); 
        })
        .then(() => {
            console.log('Seederi su uspešno izvršeni!');
        })
        .catch((err) => {
            console.error('Greška pri bazi (migracije/seederi):', err);
        });
}

const connectWithRetry = () => {
    db.raw('SELECT 1')
        .then(() => {
            console.log(`Uspešno povezano na MySQL bazu u ${environment} modu!`);
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