const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');

router.post('/crea', logController.crearLog);
router.get('/', logController.obtenerLogs);
router.get('/usuario/:usuarioId', logController.obtenerLogsPorUsuario);
router.get('/rango', logController.obtenerLogsPorRangoDeFechas);

module.exports = router;