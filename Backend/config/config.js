// config/config.js
require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura',
  emailConfig: {
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
      user: process.env.EMAIL_USER || 'tu_correo@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'tu_contraseña',
    },
  },
};