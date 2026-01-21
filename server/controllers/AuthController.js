const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.universalLogin = async (req, res) => {
    const { username, password, kod } = req.body;

    try {
        
        if (kod && !username) {
            const [adminRows] = await db.query(
                'SELECT * FROM administrator WHERE kod = ?',
                [kod]
            );

            if (adminRows.length === 0) {
                return res.status(401).json({ message: "Neispravan admin kod!" });
            }

            const admin = adminRows[0];
            const token = jwt.sign({ id: admin.adminID, role: 'admin' }, 'tajni_kljuc', { expiresIn: '7h' });
            
            return res.status(200).json({
                message: "Uspešna prijava Administratora!",
                token: token,
                user: { id: admin.adminID, ime: admin.ime, role: 'admin' }
            });
        }

        
        if (username && password) {
            
            const [studentRows] = await db.query('SELECT * FROM student WHERE username = ?', [username]);
            
            if (studentRows.length > 0) {
                const student = studentRows[0];
                const isMatch = await bcrypt.compare(password, student.password);
                if (isMatch) {
                    const token = jwt.sign({ id: student.studentID, role: 'student' }, 'tajni_kljuc', { expiresIn: '7h' });
                    return res.status(200).json({ message: "Uspešna prijava Studenta!", token, user: student });
                }
            }

            
            const [nastavnikRows] = await db.query('SELECT * FROM nastavnik WHERE username = ?', [username]);
            
            if (nastavnikRows.length > 0) {
                const nastavnik = nastavnikRows[0];
                const isMatch = await bcrypt.compare(password, nastavnik.password);
                if (isMatch) {
                    const token = jwt.sign({ id: nastavnik.nastavnikID, role: 'nastavnik' }, 'tajni_kljuc', { expiresIn: '7h' });
                    return res.status(200).json({ message: "Uspešna prijava Nastavnika!", token, user: nastavnik });
                }
            }
        }

        
        return res.status(400).json({ message: "Pogrešni kredencijali ili nepotpuni podaci." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ 
        message: "Nastavnik je uspešno odjavljen. Token više nije validan na frontendu." 
    });
};