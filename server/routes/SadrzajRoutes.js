const express = require('express');
const router = express.Router();
const sadrzajController = require('../controllers/SadrzajController');

router.post('/add', sadrzajController.createSadrzaj);

module.exports = router;