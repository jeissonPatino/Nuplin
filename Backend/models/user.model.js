// models/user.model.js
const connection = require('../config/config');

const Usuario = {
  findByEmail: (email, callback) => {
    connection.query('SELECT * FROM usuarios WHERE correo = ?', [email], (err, results) => {
      if (err) {
        console.error('Error al buscar usuario por correo:', err);
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  findById: (id, callback) => {
    connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error al buscar usuario por ID:', err);
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  crear: (usuario, callback) => {
    connection.query('INSERT INTO usuarios (id, correo, password, nombre, apellido, id_rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usuario.id, usuario.correo, usuario.password, usuario.nombre, usuario.apellido, usuario.id_rol, usuario.estado],
      (err, results) => {
        if (err) {
          console.error('Error al crear usuario:', err);
          return callback(err, null);
        }
        callback(null, results.insertId);
      });
  },

  actualizar: (usuario, callback) => {
    connection.query('UPDATE usuarios SET password = ?, nombre = ?, apellido = ?, id_rol = ?, estado = ? WHERE id = ?',
      [usuario.password, usuario.nombre, usuario.apellido, usuario.id_rol, usuario.estado, usuario.id],
      (err, results) => {
        if (err) {
          console.error('Error al actualizar usuario:', err);
          return callback(err, null);
        }
        callback(null, results.affectedRows);
      });
  },

  eliminar: (id, callback) => {
    connection.query('DELETE FROM usuarios WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar usuario:', err);
        return callback(err, null);
      }
      callback(null, results.affectedRows);
    });
  },

  obtenerTodos: (callback) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
      if (err) {
        console.error('Error al obtener todos los usuarios:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },
};

module.exports = Usuario;