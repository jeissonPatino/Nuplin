const dbConfig = require('../config/config');

const Log = {
  crearLog: (logEntry, callback) => {
    dbConfig.connection.query(
      'INSERT INTO logs (emialUsuario, logLevel, moduloOrigen, mensaje, detalles) VALUES (?, ?, ?, ?, ?)',
      [logEntry.emialUsuario, logEntry.logLevel, logEntry.moduloOrigen, logEntry.mensaje, logEntry.detalles],
      (err, results) => {
        if (err) {
          console.error('Error al crear log:', err);
          return callback(err, null);
        }
        callback(null, results.insertId);
      }
    );
  },

  obtenerLogs: (callback) => {
    dbConfig.connection.query('SELECT * FROM logs', (err, results) => {
      if (err) {
        console.error('Error al obtener logs:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  obtenerLogsPorUsuario: (emialUsuario, callback) => {
    dbConfig.connection.query('SELECT * FROM logs WHERE emialUsuario = ?', [emialUsuario], (err, results) => {
      if (err) {
        console.error('Error al obtener logs por usuario:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  obtenerLogsPorRangoDeFechas: (fechaInicio, fechaFin, callback) => {
    dbConfig.connection.query('SELECT * FROM logs WHERE fechaCreacion >= ? AND fechaCreacion <= ?', [fechaInicio, fechaFin], (err, results) => {
      if (err) {
        console.error('Error al obtener logs por rango de fechas:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },
};

module.exports = Log;