/**
 * @swagger
 * tags:
 *   name: Grupe
 *   description: Upravljanje grupama u sistemu
 */

/**
 * @swagger
 * /api/grupa/create:
 *   post:
 *     summary: Kreiranje nove grupe
 *     description: Kreira novu grupu u sistemu. Zahteva validan JWT token.
 *     tags:
 *       - Grupe
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
 *               - godina
 *               - nastavnikID
 *               - sadržajID
 *             properties:
 *               naziv:
 *                 type: string
 *                 example: "Grupa A"
 *               godina:
 *                 type: integer
 *                 example: 2025
 *               nastavnikID:
 *                 type: integer
 *                 example: 2
 *               sadržajID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Grupa uspešno kreirana
 *       400:
 *         description: Neispravni podaci
 *       401:
 *         description: Neautorizovan pristup
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/grupa/update/{id}:
 *   put:
 *     summary: Ažuriranje grupe
 *     description: Ažurira podatke o grupi na osnovu ID-a. Zahteva validan JWT token.
 *     tags:
 *       - Grupe
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID grupe koja se ažurira
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
 *                 example: "Grupa B"
 *               godina:
 *                 type: integer
 *                 example: 2026
 *               nastavnikID:
 *                 type: integer
 *                 example: 3
 *               sadržajID:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Grupa uspešno ažurirana
 *       401:
 *         description: Neautorizovan pristup
 *       404:
 *         description: Grupa nije pronađena
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/grupa/select:
 *   get:
 *     summary: Vrati listu svih grupa
 *     description: Vraća kompletnu listu grupa iz baze podataka. Zahteva validan JWT token.
 *     tags:
 *       - Grupe
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista grupa uspešno vraćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   grupaID:
 *                     type: integer
 *                     example: 1
 *                   naziv:
 *                     type: string
 *                     example: "Grupa A"
 *                   godina:
 *                     type: integer
 *                     example: 2025
 *                   nastavnikID:
 *                     type: integer
 *                     example: 2
 *                   sadržajID:
 *                     type: integer
 *                     example: 1
 *                 required:
 *                   - grupaID
 *                   - naziv
 *                   - godina
 *                   - nastavnikID
 *                   - sadržajID
 *       401:
 *         description: Neautorizovan pristup
 *       500:
 *         description: Greška na serveru
 */


const express = require('express');
const router = express.Router();
const grupaController = require('../controllers/GrupaController');
const verifyToken = require('../middleware/auth');

router.post('/create', verifyToken, grupaController.createGrupa);
router.put('/update/:id', verifyToken, grupaController.updateGrupa);
router.get('/select', verifyToken, grupaController.getGrupe);

module.exports = router;