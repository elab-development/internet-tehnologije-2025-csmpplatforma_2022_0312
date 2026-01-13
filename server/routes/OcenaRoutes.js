const express = require('express');
const router = express.Router();
const ocenaController = require('../controllers/OcenaController');

router.post('/', ocenaController.createOcena);

module.exports = router;