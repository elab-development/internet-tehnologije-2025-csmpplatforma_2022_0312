/**
 * @swagger
 * tags:
 *   name: Nastavnici
 *   description: Upravljanje nastavnicima u sistemu
 */

/**
 * @swagger
 * /api/nastavnik/register:
 *   post:
 *     summary: Registracija novog nastavnika
 *     description: Kreira novog nastavnika u sistemu.
 *     tags:
 *       - Nastavnici
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ime
 *               - prezime
 *               - username
 *               - password
 *               - adminID
 *             properties:
 *               ime:
 *                 type: string
 *                 example: "Marko"
 *               prezime:
 *                 type: string
 *                 example: "Marković"
 *               username:
 *                 type: string
 *                 example: "marko123"
 *               password:
 *                 type: string
 *                 example: "lozinka123"
 *               adminID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Nastavnik uspešno registrovan
 *       400:
 *         description: Neispravni podaci
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/nastavnik/select:
 *   get:
 *     summary: Vrati listu svih nastavnika
 *     description: Endpoint vraća kompletnu listu nastavnika iz baze podataka.
 *     tags:
 *       - Nastavnici
 *     responses:
 *       200:
 *         description: Uspešno vraćena lista nastavnika
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nastavnikID:
 *                     type: integer
 *                     example: 1
 *                   ime:
 *                     type: string
 *                     example: "Marko"
 *                   prezime:
 *                     type: string
 *                     example: "Marković"
 *                   username:
 *                     type: string
 *                     example: "marko123"
 *                   adminID:
 *                     type: integer
 *                     example: 1
 *                 required:
 *                   - nastavnikID
 *                   - ime
 *                   - prezime
 *                   - username
 *                   - adminID
 *       404:
 *         description: Nema pronađenih nastavnika
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/nastavnik/delete/{id}:
 *   delete:
 *     summary: Brisanje nastavnika
 *     description: Briše nastavnika na osnovu ID-a. Zahteva validan JWT token.
 *     tags:
 *       - Nastavnici
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID nastavnika koji se briše
 *         example: 1
 *     responses:
 *       200:
 *         description: Nastavnik uspešno obrisan
 *       401:
 *         description: Neautorizovan pristup (nevalidan token)
 *       404:
 *         description: Nastavnik nije pronađen
 *       500:
 *         description: Greška na serveru
 */


const express = require('express');
const router = express.Router();
const nastavnikController = require('../controllers/NastavnikController');
const verifyToken = require('../middleware/auth');

router.post('/register', nastavnikController.registerNastavnik);
router.get('/select', nastavnikController.getNastavnici);

router.delete('/delete/:id', verifyToken ,nastavnikController.deleteNastavnik);

module.exports = router;