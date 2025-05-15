// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes'); // Importa las rutas de usuarios
const admin = require('firebase-admin');
require('dotenv').config();

// Asegúrate de que la variable de entorno FIREBASE_CREDENTIALS esté configurada
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://<TU_PROYECTO_ID>.firebaseio.com' // Si planeas usar Realtime Database también
});

const db = admin.firestore(); // Obtén una instancia de Firestore
console.log('Firebase Admin SDK inicializado y conectado a Firestore');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', userRoutes);
app.use('/api/logs', logUsuarioRoutes);

app.get('/', (req, res) => {
  res.send('¡El backend está funcionando con Firebase!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});