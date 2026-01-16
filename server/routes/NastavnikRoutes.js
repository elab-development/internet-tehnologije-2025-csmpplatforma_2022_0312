const express = require('express');
const router = express.Router();
const nastavnikController = require('../controllers/NastavnikController');

router.post('/register', nastavnikController.registerNastavnik);
router.delete('/delete/:id', nastavnikController.deleteNastavnik);
router.get('/select', nastavnikController.getNastavnici);
router.post('/login', nastavnikController.loginNastavnik);

module.exports = router;