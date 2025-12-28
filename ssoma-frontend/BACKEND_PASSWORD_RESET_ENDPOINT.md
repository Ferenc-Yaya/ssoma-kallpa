# Endpoint Backend para Reset de Contraseña

## Endpoint Necesario

```
POST /api/usuarios/:usuarioId/reset-password
```

## Implementación en Node.js/Express

```javascript
// routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/**
 * Reset de contraseña - Envía email con token
 */
router.post('/:usuarioId/reset-password', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // 1. Buscar usuario en la BD
    const usuario = await db.query(
      'SELECT username, email, nombre_completo FROM tbl_usuarios WHERE usuario_id = $1',
      [usuarioId]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = usuario.rows[0];

    // 2. Generar token temporal (válido por 1 hora)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // 3. Guardar token en la BD
    await db.query(
      `UPDATE tbl_usuarios
       SET reset_token = $1, reset_token_expiry = $2
       WHERE usuario_id = $3`,
      [resetToken, resetTokenExpiry, usuarioId]
    );

    // 4. Enviar email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Resetear Contraseña - SSOMA Platform',
      html: `
        <h2>Resetear Contraseña</h2>
        <p>Hola ${user.nombre_completo},</p>
        <p>Has solicitado resetear tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Este enlace es válido por 1 hora.</p>
        <p>Si no solicitaste esto, ignora este correo.</p>
      `
    });

    res.json({
      message: 'Correo de reset enviado exitosamente',
      email: user.email
    });

  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ message: 'Error al enviar correo de reset' });
  }
});

/**
 * Cambiar contraseña con token
 */
router.post('/reset-password/confirm', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // 1. Validar token
    const result = await db.query(
      `SELECT usuario_id FROM tbl_usuarios
       WHERE reset_token = $1
       AND reset_token_expiry > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const usuarioId = result.rows[0].usuario_id;

    // 2. Hashear nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // 3. Actualizar contraseña y limpiar token
    await db.query(
      `UPDATE tbl_usuarios
       SET password_hash = $1,
           reset_token = NULL,
           reset_token_expiry = NULL
       WHERE usuario_id = $2`,
      [passwordHash, usuarioId]
    );

    res.json({ message: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    console.error('Error al confirmar reset:', error);
    res.status(500).json({ message: 'Error al actualizar contraseña' });
  }
});

module.exports = router;
```

## Migración para agregar campos de reset token

```sql
-- Agregar columnas para reset de contraseña
ALTER TABLE tbl_usuarios
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expiry TIMESTAMP;

CREATE INDEX idx_reset_token ON tbl_usuarios(reset_token);
```

## Configuración Frontend

Actualizar el servicio de usuarios para llamar al endpoint:

```typescript
// services/usuarios.service.ts
resetPassword(usuarioId: number): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/usuarios/${usuarioId}/reset-password`,
    {}
  );
}
```

Y en usuarios.ts reemplazar el TODO:

```typescript
resetPassword(usuario: Usuario): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    // ... config del dialog
  });

  dialogRef.afterClosed().subscribe(confirmed => {
    if (confirmed) {
      // Llamar al API
      this.usuariosService.resetPassword(usuario.usuarioId).subscribe({
        next: (response) => {
          this.showNotification(
            `Se ha enviado el correo a ${usuario.email}`,
            'success'
          );
        },
        error: (error) => {
          this.showNotification('Error al enviar correo', 'error');
        }
      });
    }
  });
}
```
