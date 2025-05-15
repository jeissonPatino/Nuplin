// controllers/log-usuario.controller.js
const admin = require('firebase-admin');
const db = admin.firestore();
const { COLLECTION_NAME } = require('../models/log-usuario.model');

exports.crearLog = async (req, res) => {
  try {
    const { emialUsuario, logLevel, moduloOrigen, mensaje, detalles } = req.body;
    const logEntry = {
      emialUsuario,
      logLevel,
      moduloOrigen,
      mensaje,
      detalles,
      timestamp: admin.firestore.FieldValue.serverTimestamp(), // Añade una marca de tiempo del servidor
    };
    const docRef = await db.collection(COLLECTION_NAME).add(logEntry);
    const docSnapshot = await docRef.get();
    res.status(201).json({ id: docSnapshot.id, ...docSnapshot.data() });
  } catch (error) {
    console.error('Error al crear log:', error);
    res.status(500).json({ message: 'Error al crear la entrada de log' });
  }
};

exports.obtenerLogs = async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION_NAME).orderBy('timestamp', 'desc').get();
    const logs = [];
    snapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    res.json(logs);
  } catch (error) {
    console.error('Error al obtener logs:', error);
    res.status(500).json({ message: 'Error al obtener los logs' });
  }
};

exports.obtenerLogsPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const snapshot = await db.collection(COLLECTION_NAME)
                             .where('emialUsuario', '==', usuarioId)
                             .orderBy('timestamp', 'desc')
                             .get();
    const logs = [];
    snapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    res.json(logs);
  } catch (error) {
    console.error('Error al obtener logs por usuario:', error);
    res.status(500).json({ message: 'Error al obtener los logs del usuario' });
  }
};

exports.obtenerLogsPorRangoDeFechas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin + 'T23:59:59.999Z'); // Incluye hasta el final del día

    const snapshot = await db.collection(COLLECTION_NAME)
                             .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(startDate))
                             .where('timestamp', '<=', admin.firestore.Timestamp.fromDate(endDate))
                             .orderBy('timestamp', 'desc')
                             .get();
    const logs = [];
    snapshot.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    res.json(logs);
  } catch (error) {
    console.error('Error al obtener logs por rango de fechas:', error);
    res.status(500).json({ message: 'Error al obtener los logs por rango de fechas' });
  }
};