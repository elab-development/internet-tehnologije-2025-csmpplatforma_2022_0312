const express = require('express');
const router = express.Router();
const nastavnikController = require('../controllers/NastavnikController');

router.post('/register', nastavnikController.registerNastavnik);

module.exports = router;