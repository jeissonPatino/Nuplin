// models/user.model.js
// Este es un ejemplo básico. Podrías usar Mongoose o Sequelize para interactuar con una base de datos.
const users = [
    { id: 1, email: 'usuario@example.com', password: 'contraseñaHasheada', active: 1, role: 'admin' },
    // ... más usuarios
  ];
  
  module.exports = {
    findByEmail: (email) => users.find(user => user.email === email),
    // Aquí podrías agregar funciones para interactuar con tu base de datos
  };