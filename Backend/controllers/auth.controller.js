const admin = require('firebase-admin');
const db = admin.firestore();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { enviarCodigoVerificacion } = require('./auth.utils');
const { secret } = require('../config/config'); 

exports.registro = async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;

    // 1. Verificar si el correo ya existe
    const userSnapshot = await db.collection('usuarios').where('correo', '==', correo).get();
    if (!userSnapshot.empty) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear el nuevo usuario en Firestore
    const nuevoUsuario = {
      id: correo, // Podemos usar el correo como ID único
      correo: correo,
      password: hashedPassword,
      nombre: nombre,
      apellido: apellido,
      id_rol: 'cliente', // Rol por defecto al registrarse
      estado: 'activo',
      fecha_creacion: admin.firestore.FieldValue.serverTimestamp(),
      fecha_actualizacion: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('usuarios').doc(correo).set(nuevoUsuario);

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1. Buscar al usuario por correo
    const userSnapshot = await db.collection('usuarios').where('correo', '==', correo).get();
    if (userSnapshot.empty) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const usuario = userSnapshot.docs[0].data();

    // 2. Comparar la contraseña ingresada con la contraseña hasheada
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 3. Generar un token JWT
    const token = jwt.sign({ sub: usuario.correo, role: usuario.id_rol }, secret, { expiresIn: '1h' });

    res.status(200).json({ token: token, userData: { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre, apellido: usuario.apellido, id_rol: usuario.id_rol } });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};

exports.dobleAuth = async (req, res) => {
  const { email } = req.body;

  const envioExitoso = await enviarCodigoVerificacion(email);
  if (envioExitoso) {
    res.status(200).json({ message: 'Código de verificación enviado al correo electrónico.' });
  } else {
    res.status(500).json({ message: 'Error al enviar el código de verificación.' });
  }
};

exports.verificarCodigoController = async (req, res) => {
  const { email, codigo } = req.body;
  const resultado = await verificarCodigo(email, codigo);

  if (resultado.valido) {
    // Si el código es válido, podrías generar un nuevo token o marcar la cuenta como verificada
    // Para este ejemplo, generaremos un nuevo token
    const userSnapshot = await db.collection('usuarios').doc(email).get();
    const usuario = userSnapshot.data();
    const token = jwt.sign({ sub: usuario.correo, role: usuario.id_rol }, secret, { expiresIn: '1h' });
    res.status(200).json({ token: token, message: 'Código de verificación correcto.' });
  } else {
    res.status(400).json({ message: resultado.mensaje });
  }
};