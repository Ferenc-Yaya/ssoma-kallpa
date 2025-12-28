/**
 * Script para generar hash de contraseña usando bcrypt
 *
 * Uso:
 * 1. Instalar bcrypt: npm install bcrypt
 * 2. Ejecutar: node generate-password-hash.js
 */

const bcrypt = require('bcrypt');

// CAMBIA ESTA CONTRASEÑA por la que quieras
const nuevaPassword = 'Admin123!';

// Número de rondas de salt (10 es estándar, más alto = más seguro pero más lento)
const saltRounds = 10;

bcrypt.hash(nuevaPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar hash:', err);
    return;
  }

  console.log('\n=================================================');
  console.log('Hash generado exitosamente!');
  console.log('=================================================');
  console.log('\nContraseña original:', nuevaPassword);
  console.log('\nHash bcrypt:', hash);
  console.log('\n=================================================');
  console.log('SQL para actualizar en la base de datos:');
  console.log('=================================================\n');
  console.log(`UPDATE tbl_usuarios`);
  console.log(`SET password_hash = '${hash}'`);
  console.log(`WHERE username = 'superadmin';`);
  console.log('\n=================================================\n');
});
