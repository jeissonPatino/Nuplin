// controllers/user.controller.js
const Usuario = require('../models/user.model');

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
    const listaUsuarios = req.body;
    const resultados = [];

    for (const usuario of listaUsuarios) {
      await new Promise((resolve, reject) => {
        connection.query('UPDATE usuarios SET password = ?, nombre = ?, apellido = ?, id_rol = ?, estado = ? WHERE id = ?',
          [usuario.password, usuario.nombre, usuario.apellido, usuario.id_rol, usuario.estado, usuario.id],
          (err, result) => {
            if (err) {
              console.error('Error al actualizar usuario:', err);
              reject(err);
              return;
            }
            resultados.push({ id: usuario.id, affectedRows: result.affectedRows });
            resolve();
          }
        );
      });
    }

    res.json({ message: 'Usuarios actualizados exitosamente', data: resultados });
  } catch (error) {
    console.error('Error al actualizar usuarios:', error);
    res.status(500).json({ message: 'Error al actualizar usuarios' });
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
    const listaIDUsuarios = req.body;
    const resultados = [];

    for (const id of listaIDUsuarios) {
      await new Promise((resolve, reject) => {
        connection.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
          if (err) {
            console.error('Error al eliminar usuario:', err);
            reject(err);
            return;
          }
          resultados.push({ id: id, affectedRows: result.affectedRows });
          resolve();
        });
      });
    }

    res.json({ message: 'Usuarios desactivados exitosamente', data: { deletedCount: resultados.reduce((sum, res) => sum + res.affectedRows, 0) } });
  } catch (error) {
    console.error('Error al desactivar usuarios:', error);
    res.status(500).json({ message: 'Error al desactivar usuarios' });
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

exports.obtenerUsuariosAdministrador = async (res)=>{
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

exports.obtenerUsuariosClientesVehiculos = async ( res)=>{
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