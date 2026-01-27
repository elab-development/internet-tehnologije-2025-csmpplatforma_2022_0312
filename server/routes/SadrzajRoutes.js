const express = require('express');
const router = express.Router();
const sadrzajController = require('../controllers/SadrzajController');

router.get('/tipovi', sadrzajController.getUnikatniTipovi);
router.post('/add', sadrzajController.createSadrzaj);
router.get('/select', sadrzajController.getSadrzaj);


module.exports = router;