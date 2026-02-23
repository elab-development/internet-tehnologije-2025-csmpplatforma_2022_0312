/**
 * @swagger
 * tags:
 *   name: Projekti
 *   description: Upravljanje projektima u sistemu
 */

/**
 * @swagger
 * /api/projekat/add:
 *   post:
 *     summary: Kreiranje novog projekta
 *     description: Kreira novi projekat. Zahteva validan JWT token.
 *     tags:
 *       - Projekti
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - naziv
 *               - opis
 *               - studentID
 *             properties:
 *               naziv:
 *                 type: string
 *                 example: "Sistem za upravljanje projektima"
 *               opis:
 *                 type: string
 *                 example: "Web aplikacija za evidenciju studentskih projekata."
 *               odgovor:
 *                 type: string
 *                 example: "Link ka GitHub repozitorijumu"
 *               studentID:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Projekat uspešno kreiran
 *       400:
 *         description: Neispravni podaci
 *       401:
 *         description: Neautorizovan pristup
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/projekat/update/{id}:
 *   put:
 *     summary: Ažuriranje projekta
 *     description: Ažurira podatke o projektu na osnovu ID-a. Zahteva validan JWT token.
 *     tags:
 *       - Projekti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID projekta koji se ažurira
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naziv:
 *                 type: string
 *                 example: "Novi naziv projekta"
 *               opis:
 *                 type: string
 *                 example: "Izmenjen opis projekta"
 *               odgovor:
 *                 type: string
 *                 example: "Ažurirani link"
 *               studentID:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Projekat uspešno ažuriran
 *       401:
 *         description: Neautorizovan pristup
 *       404:
 *         description: Projekat nije pronađen
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/projekat/delete/{id}:
 *   delete:
 *     summary: Brisanje projekta
 *     description: Briše projekat na osnovu ID-a. Zahteva validan JWT token.
 *     tags:
 *       - Projekti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID projekta koji se briše
 *         example: 1
 *     responses:
 *       200:
 *         description: Projekat uspešno obrisan
 *       401:
 *         description: Neautorizovan pristup
 *       404:
 *         description: Projekat nije pronađen
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/projekat:
 *   get:
 *     summary: Vrati sve projekte
 *     description: Vraća listu svih projekata. Zahteva validan JWT token.
 *     tags:
 *       - Projekti
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista projekata uspešno vraćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   projekatID:
 *                     type: integer
 *                     example: 1
 *                   naziv:
 *                     type: string
 *                     example: "Sistem za upravljanje projektima"
 *                   opis:
 *                     type: string
 *                     example: "Web aplikacija za evidenciju studentskih projekata"
 *                   odgovor:
 *                     type: string
 *                     example: "GitHub link"
 *                   studentID:
 *                     type: integer
 *                     example: 3
 *                 required:
 *                   - projekatID
 *                   - naziv
 *                   - studentID
 *       401:
 *         description: Neautorizovan pristup
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/projekat/{id}:
 *   get:
 *     summary: Vrati projekat po ID-u
 *     description: Vraća detalje jednog projekta na osnovu ID-a. Zahteva validan JWT token.
 *     tags:
 *       - Projekti
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID projekta
 *         example: 1
 *     responses:
 *       200:
 *         description: Projekat uspešno pronađen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projekatID:
 *                   type: integer
 *                   example: 1
 *                 naziv:
 *                   type: string
 *                   example: "Sistem za upravljanje projektima"
 *                 opis:
 *                   type: string
 *                   example: "Web aplikacija za evidenciju studentskih projekata"
 *                 odgovor:
 *                   type: string
 *                   example: "GitHub link"
 *                 studentID:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Neautorizovan pristup
 *       404:
 *         description: Projekat nije pronađen
 *       500:
 *         description: Greška na serveru
 */


const express = require('express');
const router = express.Router();
const projekatController = require('../controllers/ProjekatController');
const verifyToken = require('../middleware/auth'); 


router.post('/add', verifyToken, projekatController.createProjekat);
router.put('/update/:id', verifyToken, projekatController.updateProjekat);
router.delete('/delete/:id', verifyToken, projekatController.deleteProjekat);

router.get('/download/:id', verifyToken, projekatController.downloadPDF);

router.get('/', verifyToken, projekatController.getProjekti); 
router.get('/:id', verifyToken, projekatController.getProjekti); 


module.exports = router;

