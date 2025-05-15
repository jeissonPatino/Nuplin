// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getUsuarios);
router.put('/actualizar', userController.updateUser);
router.post('/crear', userController.createUser);
router.put('/desactivar', userController.deleteUser);

module.exports = router;