const db = require('../config/db');
const { generateProjectPDF } = require('../services/pdfService');

exports.createProjekat = async (req, res) => {
    const { naziv, opis, studentID, studentIme } = req.body;
    const imeZaPdf = studentIme || (req.user ? `${req.user.ime}` : "Student platforme");
    try {
        const pdfBuffer = await generateProjectPDF(naziv, opis, imeZaPdf);
        await db.query(
            'INSERT INTO projekat (naziv, opis, studentID, pdf_data) VALUES (?, ?, ?, ?)',
            [naziv, opis, studentID, pdfBuffer]
        );
        res.status(201).json({ message: "Projekat i pdf uspešno kreirani!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteProjekat = async (req, res) => {
    const { id } = req.params; 

    try {
        const [result] = await db.query(
            'DELETE FROM projekat WHERE projekatID = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Projekat nije pronađen!" });
        }

        res.status(200).json({ message: "Projekat uspešno obrisan!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateProjekat = async (req, res) => {
    const { id } = req.params;
    const updates = req.body; 

    const keys = Object.keys(updates);
    if (keys.length === 0) {
        return res.status(400).json({ message: "Nema podataka za izmenu" });
    }

    try {
        
        if (updates.naziv || updates.opis) {
            
            
            const [rows] = await db.query('SELECT naziv, opis FROM projekat WHERE projekatID = ?', [id]);
            if (rows.length > 0) {
                const noviNaziv = updates.naziv || rows[0].naziv;
                const noviOpis = updates.opis || rows[0].opis;
                const studentIme = updates.studentIme || "Student platforme";

                
                const noviPdfBuffer = await generateProjectPDF(noviNaziv, noviOpis, studentIme);
                
                // Dodajemo pdf_data u listu za update
                updates.pdf_data = noviPdfBuffer;
                
                
                delete updates.studentIme;
            }
        }

        
        const finalKeys = Object.keys(updates);
        const setQuery = finalKeys.map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);

        const [result] = await db.query(
            `UPDATE projekat SET ${setQuery} WHERE projekatID = ?`,
            [...values, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Projekat nije pronađen!" });
        }

        res.status(200).json({ message: "Uspešno sačuvano i PDF ažuriran!" });
    } catch (err) {
        console.error("Greška pri update-u projekta:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getProjekti = async (req, res) => {
    const id = req.params.id;
    const tip = req.query.tip; 

    try {
        let query;
        let params = [id];

        if (tip === 'pojedinacno') {
            query = `
                SELECT p.*, s.ime, s.prezime 
                FROM projekat p 
                LEFT JOIN student s ON p.studentID = s.studentID 
                WHERE p.projekatID = ?`;
        } else if (id && id !== 'undefined') {
            query = 'SELECT * FROM projekat WHERE studentID = ?';
        } else {
            query = `
                SELECT p.*, s.ime, s.prezime 
                FROM projekat p 
                LEFT JOIN student s ON p.studentID = s.studentID
            `;
            params = [];
        }

        const [results] = await db.query(query, params);

        if (tip === 'pojedinacno') {
            return res.status(200).json(results[0] || {});
        }
        
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.downloadPDF = async (req, res) => {
    const { id } = req.params;

    try {
        // Izvlačimo pdf_data i naziv (da bismo dali ime fajlu)
        const [rows] = await db.query(
            'SELECT pdf_data, naziv FROM projekat WHERE projekatID = ?', 
            [id]
        );

        if (rows.length === 0 || !rows[0].pdf_data) {
            return res.status(404).json({ message: "PDF dokument nije pronađen." });
        }

        const pdfFajl = rows[0].pdf_data;
        const nazivProjekta = rows[0].naziv.replace(/\s+/g, '_'); 

        // Podešavamo headere tako da browser prepozna da šaljemo PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Dokumentacija_${nazivProjekta}.pdf`);
        
        // Šaljemo buffer
        res.send(pdfFajl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};