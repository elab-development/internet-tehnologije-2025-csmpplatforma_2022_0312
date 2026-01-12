const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Osnovna ruta (da proverimo da li radi)
app.get('/', (req, res) => {
    res.send('CSMP Backend Server uspesno pokrenut!');
});

app.listen(PORT, () => {
    console.log(`Server radi na portu: ${PORT}`);
});