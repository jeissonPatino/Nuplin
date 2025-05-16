// Ejemplo de configuración de conexión usando la librería 'mysql'
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '192.168.80.22', // Reemplaza con la IP del otro PC
  user: 'developer',     // Reemplaza con el usuario que creaste
  password: 'Jp.1023000929.1',         // Reemplaza con la contraseña
  database: 'developer' // Reemplaza con el nombre de tu base de datos
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida.');
});

module.exports = connection; // Exporta la conexión para usarla en tus modelos/controladores