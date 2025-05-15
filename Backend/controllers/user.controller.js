// controllers/user.controller.js
const admin = require('firebase-admin');
const db = admin.firestore();

exports.getUsuarios = async (req, res) => {
  try {
    const { fechaInicial, fechaFinal, paquete } = req.query;
    const usersRef = db.collection('users');
    let query = usersRef.where('fechaCreacion', '>=', new Date(fechaInicial))
                       .where('fechaCreacion', '<=', new Date(fechaFinal + 'T23:59:59.999Z'));
    if (paquete) {
      query = query.where('paquete', '==', paquete);
    }
    const snapshot = await query.get();
    const usuarios = [];
    snapshot.forEach(doc => {
      usuarios.push({ id: doc.id, ...doc.data() });
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const listaUsuarios = req.body;
    const resultados = await Promise.all(listaUsuarios.map(async (usuario) => {
      const userRef = db.collection('users').doc(usuario.id); // Asume que cada usuario en la lista tiene un 'id' que corresponde al ID del documento en Firestore
      await userRef.update(usuario);
      const updatedDoc = await userRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    }));
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
      const docRef = await db.collection('users').add(usuario);
      const docSnapshot = await docRef.get();
      resultados.push({ id: docSnapshot.id, ...docSnapshot.data() });
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
    const results = await Promise.all(listaIDUsuarios.map(async (id) => {
      await db.collection('users').doc(id.toString()).delete(); // Asume que los IDs son strings en Firestore
      return id;
    }));
    res.json({ message: 'Usuarios desactivados exitosamente', data: { deletedCount: results.length } });
  } catch (error) {
    console.error('Error al desactivar usuarios:', error);
    res.status(500).json({ message: 'Error al desactivar usuarios' });
  }
};