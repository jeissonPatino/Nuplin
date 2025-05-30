const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'Andres12345*';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hash generado:', hashedPassword);
}

generateHash();