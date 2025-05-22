const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/user.model');
const { enviarCodigoVerificacion, verificarCodigo } = require('../utils/auth.utils');
const { secret } = require('../config/config');

exports.registro = async (req, res) => {
  try {
    const { firstname, lastname, email, password, NumberIdentification, typeIdentification } = req.body; // Obtén NumberIdentification

    // 1. Verificar si el NumberIdentification ya existe (asumiendo que 'id' en tu tabla es para NumberIdentification)
    Usuario.findById(NumberIdentification, (err, existingUser) => { // Usa findById para buscar por el id (NumberIdentification)
      if (err) {
        console.error('Error al verificar ID:', err);
        return res.status(500).json({ message: 'Error al verificar el número de identificación.' });
      }
      if (existingUser) {
        return res.status(409).json({ message: 'El número de identificación ya está registrado.' });
      }

      // 2. Hashear la contraseña
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error al hashear la contraseña:', err);
          return res.status(500).json({ message: 'Error al registrar el usuario.' });
        }

        const nuevoUsuario = {
          id: NumberIdentification, 
          correo: email, 
          password: hashedPassword,
          nombre: firstname,
          apellido: lastname,
          id_tipo_documento: typeIdentification,
          id_rol: 2,
          estado: 'activo',
        };

        Usuario.crear(nuevoUsuario, (err, userId) => {
          if (err) {
            console.error('Error al crear usuario:', err);
            return res.status(500).json({ message: 'Error al registrar el usuario.' });
          }
          res.status(201).json({ message: 'Usuario registrado exitosamente.', userId: userId });
        });
      });
    });
  } catch (error) {
    console.error('Error en el proceso de registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};
  

exports.login = async (req, res) => {
  try {
   
    const { correo, password } = req.body;
    Usuario.findByEmail(correo, (err, usuario) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({ message: 'Error al iniciar sesión.' });
      }
      if (!usuario) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }
      bcrypt.compare(password, usuario.password, (err, passwordValido) => {
        if (err) {
          console.error('Error al comparar contraseñas:', err);
          return res.status(500).json({ message: 'Error al iniciar sesión.' });
        }
        if (!passwordValido) {
          return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const token = jwt.sign({ sub: usuario.correo, role: usuario.id_rol }, secret, { expiresIn: '1h' });
        res.status(200).json({ token: token, userData: { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre, apellido: usuario.apellido, id_rol: usuario.id_rol } });
      });
    });
  } catch (error) {
    console.error('Error en el proceso de inicio de sesión:', error);
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
  console.log(resultado.valido, 'Resultado de la validacion del codigo y correo')
  if (resultado.valido) {
    Usuario.findByEmail(email, (err, usuario) => {
      if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({ message: 'Error al verificar el código.' });
      }
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      const token = jwt.sign({ sub: usuario.correo, role: usuario.id_rol }, secret, { expiresIn: '1h' });
      res.status(200).json({ token: token, message: 'Código de verificación correcto.' });
      console.log(token,' token' )
    });
  } else {
    res.status(400).json({ message: resultado.mensaje });
    console.log(resultado.mensaje,' resultado.mensaje' )
  }
};

