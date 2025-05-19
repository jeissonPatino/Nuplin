const Log = require('../models/log.model');

exports.crearLog = async (req, res) => {
  try {
    const logEntry = req.body;
    Log.crearLog(logEntry, (err, logId) => {
      if (err) {
        return res.status(500).json({ message: 'Error al crear el log' });
      }
      res.status(201).json({ message: 'Log creado exitosamente', logId });
    });
  } catch (error) {
    console.error('Error en crearLog:', error);
    res.status(500).json({ message: 'Error al crear el log' });
  }
};

exports.obtenerLogs = async (req, res) => {
  Log.obtenerLogs((err, logs) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los logs' });
    }
    res.json(logs);
  });
};

exports.obtenerLogsPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;
  Log.obtenerLogsPorUsuario(usuarioId, (err, logs) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los logs del usuario' });
    }
    res.json(logs);
  });
};

exports.obtenerLogsPorRangoDeFechas = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  Log.obtenerLogsPorRangoDeFechas(fechaInicio, fechaFin, (err, logs) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los logs por rango de fechas' });
    }
    res.json(logs);
  });
};