// routes/log-usuario.routes.js
const express = require('express');
const router = express.Router();
const logUsuarioController = require('../controllers/log-usuario.controller');

router.post('/crea', logUsuarioController.crearLog);
router.get('/', logUsuarioController.obtenerLogs);
router.get('/usuario/:usuarioId', logUsuarioController.obtenerLogsPorUsuario);
router.get('/rango', logUsuarioController.obtenerLogsPorRangoDeFechas);

module.exports = router;