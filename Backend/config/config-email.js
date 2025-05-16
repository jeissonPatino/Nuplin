require('dotenv').config();

module.exports = {
  mailConfig: {
    service: process.env.EMAIL_SERVICE || 'Gmail',
    auth: {
      user: process.env.EMAIL_USER || 'tu_correo@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'tu_contraseña',
    },
  },
};