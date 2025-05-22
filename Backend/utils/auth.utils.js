const nodemailer = require('nodemailer');
const { mailConfig } = require('../config/config-email');
const dbConfig = require('../config/config');

const CODIGO_EXPIRACION_MINUTOS = 15;

const transporter = nodemailer.createTransport(mailConfig);

function generarCodigoVerificacion() {
  return Math.random().toString(10).substring(2, 8);
}

exports.enviarCodigoVerificacion = async (email) => {
  const codigo = generarCodigoVerificacion();
  const now = new Date();
  

  try {
    dbConfig.connection.query(
      'REPLACE INTO codigos_verificacion (email_usuario, codigo, fecha_creacion) VALUES (?, ?, ?)',
      [email, codigo, now],
      (err, results) => {
        if (err) {
          console.error('Error al guardar el código de verificación:', err);
          return false;
        }

        const mailOptions = {
          from: mailConfig.auth.user,
          to: email,
          subject: 'Código de Verificación de NuplinTv',
          html: `<p>Tu código de verificación es: <strong>${codigo}</strong>. Este código expirará en 15 minutos.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error al enviar el correo electrónico:', error);
            return false;
          }
          console.log('Correo electrónico enviado:', info.messageId);
          return true;
        });
        return true;
      }
    );
    return true;
  } catch (error) {
    console.error('Error en enviarCodigoVerificacion:', error);
    return false;
  }
};

exports.enviarCorreoNuevoUsuario = async (email, nombre, password) => {
  const mailOptions = {
    from: mailConfig.auth.user,
    to: email,
    subject: 'Bienvenido a NuplinTv - Detalles de su cuenta de Administrador',
    html: `<p>Hola ${nombre},</p>
           <p>Se ha creado una cuenta de administrador para usted en NuplinTv.</p>
           <p>Su contraseña temporal es: <strong>${password}</strong></p>
           <p>Por favor, inicie sesión con esta contraseña y considere cambiarla por una más segura.</p>
           <p>Gracias,</p>
           <p>El equipo de NuplinTv</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico de nuevo usuario enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo electrónico de nuevo usuario:', error);
    return false;
  }
};

exports.verificarCodigo = async (email, codigoIngresado) => {
  try {
    const results = await new Promise((resolve, reject) => {
      dbConfig.connection.query(
        'SELECT * FROM codigos_verificacion WHERE email_usuario = ? ORDER BY fecha_creacion DESC LIMIT 1',
        [email],
        (err, results) => {
          if (err) {
            console.error('Error al verificar el código:', err);
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    });
    if (results.length > 0) {
      const codigoVerificacion = results[0];
      const ahora = new Date();
      const fechaCreacion = new Date(codigoVerificacion.fecha_creacion);
      const tiempoTranscurrido = (ahora.getTime() - fechaCreacion.getTime()) / (1000 * 60);
      if (codigoVerificacion.codigo === codigoIngresado && tiempoTranscurrido <= CODIGO_EXPIRACION_MINUTOS) {
        return { valido: true }; 
      } else {
        return { valido: false, mensaje: 'El código ha expirado.' }; 
      }
    } else {
      return { valido: false, mensaje: 'Código incorrecto.' };
    }
  } catch (error) {
    console.error('Error en verificarCodigo:', error);
    return false;
  }
};