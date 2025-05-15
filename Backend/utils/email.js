// utils/email.js
const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/config');

const transporter = nodemailer.createTransport(emailConfig);

exports.sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw error;
  }
};