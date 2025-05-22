// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getUsuarios);
router.put('/actualizar/:id', userController.updateUser);
router.post('/crear', userController.createUser);
router.post('/crearAdmin', userController.createUserAdmin);
router.delete('/desactivar/:id', userController.deleteUser); 
router.post('/session-data', userController.dataUserSession);
router.get('/usuarios-administrador', userController.obtenerUsuariosAdministrador);
router.get('/esuarios-clientes-vehiculos', userController.obtenerUsuariosClientesVehiculos);

module.exports = router;