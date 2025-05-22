// controllers/user.controller.js
const Usuario = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generarPassword, enviarCorreoNuevoUsuario } = require('../utils/auth.utils');

exports.getUsuarios = async (req, res) => {
  try {
    const { fechaInicial, fechaFinal, paquete } = req.query;
    let query = 'SELECT * FROM usuarios WHERE fecha_creacion >= ? AND fecha_creacion <= ?';
    const params = [fechaInicial, fechaFinal + ' 23:59:59'];

    if (paquete) {
      query += ' AND paquete = ?';
      params.push(paquete);
    }

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error en la consulta de usuarios:', error);
    res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const userData = req.body; 
    userData.id = id;

    Usuario.actualizar(userData, (err, affectedRows) => {
      if (err) {
        console.error('Error al actualizar usuario:', err);
        return res.status(500).json({ message: 'Error al actualizar usuario' });
      }
      if (affectedRows > 0) {
        return res.status(200).json({ message: `Usuario con ID ${id} actualizado exitosamente` });
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const listaUsuarios = req.body;
    const resultados = [];

    for (const usuario of listaUsuarios) {
      await new Promise((resolve, reject) => {
        connection.query('INSERT INTO usuarios (id, correo, password, nombre, apellido, id_rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [usuario.id, usuario.correo, usuario.password, usuario.nombre, usuario.apellido, usuario.id_rol, usuario.estado],
          (err, result) => {
            if (err) {
              console.error('Error al crear usuario:', err);
              reject(err);
              return;
            }
            resultados.push({ id: usuario.id, insertId: result.insertId });
            resolve();
          }
        );
      });
    }

    res.status(201).json({ message: 'Usuarios creados exitosamente', data: resultados });
  } catch (error) {
    console.error('Error al crear usuarios:', error);
    res.status(500).json({ message: 'Error al crear usuarios' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    Usuario.eliminar(id, (err, affectedRows) => {
      if (err) {
        console.error('Error al eliminar usuario:', err);
        return res.status(500).json({ message: 'Error al eliminar usuario' });
      }
      if (affectedRows > 0) {
        return res.status(200).json({ message: `Usuario con ID ${id} eliminado exitosamente` });
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};


exports.dataUserSession = async (req, res)=>{
  const {email} = req.body;
  Usuario.findByEmail(email, (err, usuario)=>{
    if (err) {
        console.error('Error al buscar usuario:', err);
        return res.status(500).json({ message: 'Error al verificar el código.' });
      }
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
    return res.status(200).json({ nombre: usuario.nombre, apellido: usuario.apellido });
  })

}

exports.obtenerUsuariosAdministrador = async (req, res)=>{
  Usuario.obtenerUsuariosAdministrador( (err, usuarios)=>{
    if (err) {
        console.error('Error al obtener todos los usuarios Administrador:', err);
        return res.status(500).json({ message: 'Error al verificar el código.' });
      }
      if (!usuarios) {
        return res.status(404).json({ message: 'Usuarios no encontrados.' });
      }
    return res.status(200).json(usuarios);
  })
}

exports.obtenerUsuariosClientesVehiculos = async (req, res)=>{
  Usuario.obtenerUsuariosClientesVehiculos( (err, usuarios)=>{
    if (err) {
        console.error('Error al obtener todos los usuarios Clientes con vehiculos:', err);
        return res.status(500).json({ message: 'Error al obtener todos los usuarios Clientes con vehiculos' });
      }
      if (!usuarios) {
        return res.status(404).json({ message: 'Usuarios no encontrados.' });
      }
    return res.status(200).json(usuarios);
  })
}

exports.createUserAdmin = async (req, res) => {
  try {
    const { firstname, lastname, email, password, NumberIdentification, typeIdentification } = req.body; 
    Usuario.findById(NumberIdentification, (err, existingUser) => { 
      if (err) {
        console.error('Error al verificar ID:', err);
        return res.status(500).json({ message: 'Error al verificar el número de identificación.' });
      }
      if (existingUser) {
        return res.status(409).json({ message: 'El número de identificación ya está registrado.' });
      }
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
          id_rol: 4,
          estado: 'activo',
        };

        Usuario.crear(nuevoUsuario, (err, userId) => {
          if (err) {
            console.error('Error al crear usuario:', err);
            return res.status(500).json({ message: 'Error al registrar el usuario.' });
          }
          enviarCorreoNuevoUsuario(email, firstname, password);
          res.status(201).json({ message: 'Usuario registrado exitosamente.', userId: userId });
        });
      });
    });
  } catch (error) {
    console.error('Error en el proceso de registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};