// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/dobleAuth', authController.dobleAuth);
router.post('/registro', authController.registro);
router.post('/verificarCodigo', authController.verificarCodigoController);

module.exports = router;