/**
 * @swagger
 * tags:
 *   name: Sadržaj
 *   description: Upravljanje sadržajem (zadaci, testovi)
 */

/**
 * @swagger
 * /api/sadrzaj/tipovi:
 *   get:
 *     summary: Vrati unikatne tipove sadržaja
 *     description: Vraća listu svih jedinstvenih tipova sadržaja iz baze.
 *     tags:
 *       - Sadržaj
 *     responses:
 *       200:
 *         description: Lista tipova uspešno vraćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Projektni zadatak"
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/sadrzaj/add:
 *   post:
 *     summary: Kreiranje novog sadržaja
 *     description: Dodaje novi sadržaj u sistem.
 *     tags:
 *       - Sadržaj
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - naziv
 *               - tip
 *               - maxPoena
 *               - pitanje
 *               - rok
 *               - nastavnikID
 *             properties:
 *               naziv:
 *                 type: string
 *                 example: "Iteh"
 *               tip:
 *                 type: string
 *                 example: "kolokvijum"
 *               maxPoena:
 *                 type: integer
 *                 example: 100
 *               pitanje:
 *                 type: string
 *                 example: "uraditi mvp aplikaciju"
 *               rok:
 *                 type: string
 *                 format: date
 *                 example: "2026-02-12"
 *               nastavnikID:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Sadržaj uspešno kreiran
 *       400:
 *         description: Neispravni podaci
 *       500:
 *         description: Greška na serveru
 */

/**
 * @swagger
 * /api/sadrzaj/select:
 *   get:
 *     summary: Vrati listu svih sadržaja
 *     description: Vraća kompletnu listu sadržaja iz baze podataka.
 *     tags:
 *       - Sadržaj
 *     responses:
 *       200:
 *         description: Lista sadržaja uspešno vraćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sadrzajID:
 *                     type: integer
 *                     example: 1
 *                   naziv:
 *                     type: string
 *                     example: "mata 1"
 *                   tip:
 *                     type: string
 *                     example: "ispit"
 *                   maxPoena:
 *                     type: integer
 *                     example: 100
 *                   pitanje:
 *                     type: string
 *                     example: "Sta je matrica?"
 *                   rok:
 *                     type: string
 *                     format: date
 *                     example: "2026-02-27"
 *                   nastavnikID:
 *                     type: integer
 *                     example: 2
 *                 required:
 *                   - sadrzajID
 *                   - naziv
 *                   - tip
 *                   - maxPoena
 *                   - nastavnikID
 *       500:
 *         description: Greška na serveru
 */


const express = require('express');
const router = express.Router();
const sadrzajController = require('../controllers/SadrzajController');

router.get('/tipovi', sadrzajController.getUnikatniTipovi);
router.post('/add', sadrzajController.createSadrzaj);
router.get('/select', sadrzajController.getSadrzaj);


module.exports = router;