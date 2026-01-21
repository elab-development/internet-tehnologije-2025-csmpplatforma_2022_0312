const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const verifyToken = require('../middleware/auth'); 

router.post('/login',AuthController.universalLogin);
router.post('/logout', verifyToken ,AuthController.logout);

module.exports = router;