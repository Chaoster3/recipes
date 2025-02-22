const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/', authController.test);
router.post('/signin', authController.signin);
router.post('/register', authController.register);
router.post('/google-signin', authController.handleGoogleSignin);
router.post('/google-register', authController.handleGoogleRegister);

module.exports = router; 