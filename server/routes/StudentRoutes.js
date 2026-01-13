const express = require('express');
const router = express.Router();
const authController = require('../controllers/StudentController');

router.post('/register', authController.registerStudent);

module.exports = router;