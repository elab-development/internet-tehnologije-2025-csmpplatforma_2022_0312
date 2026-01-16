const express = require('express');
const router = express.Router();
const ocenaController = require('../controllers/OcenaController');

router.post('/', ocenaController.createOcena);
router.get('/select', ocenaController.getOcene);

module.exports = router;