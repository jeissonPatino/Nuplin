const admin = require('firebase-admin');
const db = admin.firestore();
const crypto = require('crypto');

const CODIGOS_VERIFICACION_COLLECTION = 'codigos_verificacion';
const CODIGO_EXPIRACION_MINUTOS = 15;

function generarCodigoVerificacion() {
  return Math.random().toString(10).substring(2, 8); // Genera un código de 6 dígitos
}

exports.enviarCodigoVerificacion = async (email) => {
  const codigo = generarCodigoVerificacion();
  const now = admin.firestore.Timestamp.now();
  const expiry = new Date(now.toDate().getTime() + CODIGO_EXPIRACION_MINUTOS * 60 * 1000);

  try {
    await db.collection(CODIGOS_VERIFICACION_COLLECTION).doc(email).set({
      email_usuario: email,
      codigo: codigo,
      fecha_creacion: now,
      fecha_expiracion: admin.firestore.Timestamp.fromDate(expiry),
    });

    // Aquí iría la lógica real para enviar el correo electrónico
    console.log(`Código de verificación ${codigo} enviado a ${email}`);
    return true;
  } catch (error) {
    console.error('Error al guardar el código de verificación:', error);
    return false;
  }
};

exports.verificarCodigo = async (email, codigoIngresado) => {
  // ... (función como la definimos anteriormente)
};

exports.eliminarCodigosInvalidos = async () => {
  // ... (función como la definimos anteriormente)
};