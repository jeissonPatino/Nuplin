const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');

router.get('/servicios', reporteController.getReporteServicios);
router.get('/clientes-conteo', reporteController.getReporteConteoClientes);
router.get('/clientes-conteo-resumen', reporteController.getConteoClientesResumen);

module.exports = router;