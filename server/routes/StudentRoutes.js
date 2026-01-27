const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');
const verifyToken = require('../middleware/auth');

router.post('/register', studentController.registerStudent);
router.get('/select', studentController.getStudenti);

router.delete('/delete/:id', verifyToken ,studentController.deleteStudent);
router.put('/update-grupa/:id', verifyToken, studentController.updateStudentGrupa);

module.exports = router;