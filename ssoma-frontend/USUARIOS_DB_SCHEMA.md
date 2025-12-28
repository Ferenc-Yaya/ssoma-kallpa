# Esquema de Base de Datos - Gestión de Usuarios y Roles

## Estructura de Tablas

### 1. Tabla `tbl_usuarios`

```sql
CREATE TABLE tbl_usuarios (
    usuario_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Relación con rol
    rol_id INTEGER NOT NULL REFERENCES tbl_roles(rol_id),

    -- Relación con tenant (empresa principal)
    tenant_id VARCHAR(50) REFERENCES tbl_tenants(tenant_id),
    -- Si tenant_id es NULL, es un usuario global (SUPER_ADMIN)

    -- Estado
    activo BOOLEAN DEFAULT TRUE,

    -- Auditoría
    ultimo_acceso TIMESTAMP,
    intentos_fallidos INTEGER DEFAULT 0,
    bloqueado_hasta TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES tbl_usuarios(usuario_id),
    updated_by INTEGER REFERENCES tbl_usuarios(usuario_id)
);

CREATE INDEX idx_usuarios_username ON tbl_usuarios(username);
CREATE INDEX idx_usuarios_email ON tbl_usuarios(email);
CREATE INDEX idx_usuarios_rol_id ON tbl_usuarios(rol_id);
CREATE INDEX idx_usuarios_tenant_id ON tbl_usuarios(tenant_id);
CREATE INDEX idx_usuarios_activo ON tbl_usuarios(activo);
```

### 2. Tabla `tbl_roles` (Grupos de Usuario)

```sql
CREATE TABLE tbl_roles (
    rol_id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,

    -- Jerarquía y alcance
    nivel_jerarquia INTEGER NOT NULL, -- 1=SUPER_ADMIN, 2=ADMIN_EMPRESA, 3=ADMIN_CONTRATISTA, 4=USUARIO
    requiere_tenant BOOLEAN DEFAULT TRUE, -- FALSE solo para SUPER_ADMIN

    -- Estado
    activo BOOLEAN DEFAULT TRUE,

    -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos iniciales
INSERT INTO tbl_roles (codigo, nombre, descripcion, nivel_jerarquia, requiere_tenant) VALUES
('SUPER_ADMIN', 'Super Administrador', 'Acceso completo al sistema, gestiona todas las empresas principales', 1, FALSE),
('ADMIN_EMPRESA_PRINCIPAL', 'Admin Empresa Principal', 'Administra una empresa principal y sus contratistas', 2, TRUE),
('ADMIN_CONTRATISTA', 'Admin Contratista', 'Administra una empresa contratista', 3, TRUE),
('USUARIO_EMPRESA', 'Usuario Empresa', 'Usuario con acceso limitado a empresa principal', 4, TRUE),
('USUARIO_CONTRATISTA', 'Usuario Contratista', 'Usuario con acceso limitado a contratista', 4, TRUE);
```

### 3. Tabla `tbl_permisos`

```sql
CREATE TABLE tbl_permisos (
    permiso_id SERIAL PRIMARY KEY,
    codigo VARCHAR(100) UNIQUE NOT NULL,
    modulo VARCHAR(50) NOT NULL, -- 'empresas', 'usuarios', 'acreditacion', etc.
    accion VARCHAR(50) NOT NULL, -- 'crear', 'leer', 'actualizar', 'eliminar', 'aprobar', etc.
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- Ejemplos de permisos
INSERT INTO tbl_permisos (codigo, modulo, accion, descripcion) VALUES
('empresas.crear', 'empresas', 'crear', 'Crear nuevas empresas'),
('empresas.leer', 'empresas', 'leer', 'Ver listado de empresas'),
('empresas.actualizar', 'empresas', 'actualizar', 'Editar información de empresas'),
('empresas.eliminar', 'empresas', 'eliminar', 'Eliminar empresas'),
('usuarios.gestionar', 'usuarios', 'gestionar', 'Gestionar usuarios del sistema'),
('acreditacion.aprobar', 'acreditacion', 'aprobar', 'Aprobar solicitudes de acreditación'),
('reportes.exportar', 'reportes', 'exportar', 'Exportar reportes del sistema');
```

### 4. Tabla `tbl_rol_permisos` (Relación Muchos a Muchos)

```sql
CREATE TABLE tbl_rol_permisos (
    rol_id INTEGER NOT NULL REFERENCES tbl_roles(rol_id) ON DELETE CASCADE,
    permiso_id INTEGER NOT NULL REFERENCES tbl_permisos(permiso_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rol_id, permiso_id)
);

-- Asignar todos los permisos a SUPER_ADMIN (suponiendo rol_id = 1)
INSERT INTO tbl_rol_permisos (rol_id, permiso_id)
SELECT 1, permiso_id FROM tbl_permisos;

-- Asignar permisos limitados a otros roles
INSERT INTO tbl_rol_permisos (rol_id, permiso_id)
SELECT 2, permiso_id FROM tbl_permisos
WHERE codigo IN ('empresas.leer', 'empresas.crear', 'empresas.actualizar', 'acreditacion.aprobar');
```

## Diferenciación de Grupos de Usuarios

### Opción 1: Por Rol (Recomendado)

```sql
-- Obtener usuarios por rol
SELECT u.*, r.codigo as rol_codigo, r.nombre as rol_nombre
FROM tbl_usuarios u
INNER JOIN tbl_roles r ON u.rol_id = r.rol_id
WHERE r.codigo = 'SUPER_ADMIN';

-- Obtener usuarios de una empresa principal
SELECT u.*, r.codigo as rol_codigo, r.nombre as rol_nombre
FROM tbl_usuarios u
INNER JOIN tbl_roles r ON u.rol_id = r.rol_id
WHERE u.tenant_id = 'KALLPA';

-- Obtener solo administradores
SELECT u.*, r.codigo as rol_codigo
FROM tbl_usuarios u
INNER JOIN tbl_roles r ON u.rol_id = r.rol_id
WHERE r.nivel_jerarquia <= 3;
```

### Opción 2: Por Grupos Personalizados (Avanzado)

Si necesitas agrupaciones más flexibles, puedes agregar:

```sql
CREATE TABLE tbl_grupos (
    grupo_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tenant_id VARCHAR(50) REFERENCES tbl_tenants(tenant_id),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_usuario_grupos (
    usuario_id INTEGER NOT NULL REFERENCES tbl_usuarios(usuario_id) ON DELETE CASCADE,
    grupo_id INTEGER NOT NULL REFERENCES tbl_grupos(grupo_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, grupo_id)
);
```

## Consultas Comunes

### 1. Verificar permisos de un usuario

```sql
SELECT p.*
FROM tbl_usuarios u
INNER JOIN tbl_roles r ON u.rol_id = r.rol_id
INNER JOIN tbl_rol_permisos rp ON r.rol_id = rp.rol_id
INNER JOIN tbl_permisos p ON rp.permiso_id = p.permiso_id
WHERE u.username = 'admin.kallpa'
  AND p.activo = TRUE;
```

### 2. Verificar si un usuario puede realizar una acción

```sql
SELECT EXISTS (
    SELECT 1
    FROM tbl_usuarios u
    INNER JOIN tbl_roles r ON u.rol_id = r.rol_id
    INNER JOIN tbl_rol_permisos rp ON r.rol_id = rp.rol_id
    INNER JOIN tbl_permisos p ON rp.permiso_id = p.permiso_id
    WHERE u.usuario_id = 123
      AND p.codigo = 'empresas.crear'
      AND u.activo = TRUE
      AND p.activo = TRUE
) AS tiene_permiso;
```

### 3. Listar usuarios por tenant con sus roles

```sql
SELECT
    u.usuario_id,
    u.username,
    u.nombre_completo,
    u.email,
    r.codigo as rol,
    r.nombre as rol_nombre,
    u.tenant_id,
    t.razon_social as empresa_nombre,
    u.activo,
    u.ultimo_acceso
FROM tbl_usuarios u
INNER JOIN tbl_roles r ON u.rol_id = r.rol_id
LEFT JOIN tbl_tenants t ON u.tenant_id = t.tenant_id
WHERE u.tenant_id = 'KALLPA'
ORDER BY r.nivel_jerarquia, u.nombre_completo;
```

### 4. Estadísticas de usuarios por rol

```sql
SELECT
    r.codigo,
    r.nombre,
    COUNT(u.usuario_id) as total_usuarios,
    COUNT(CASE WHEN u.activo THEN 1 END) as usuarios_activos,
    COUNT(CASE WHEN NOT u.activo THEN 1 END) as usuarios_inactivos
FROM tbl_roles r
LEFT JOIN tbl_usuarios u ON r.rol_id = u.rol_id
GROUP BY r.rol_id, r.codigo, r.nombre
ORDER BY r.nivel_jerarquia;
```

## Migraciones Recomendadas

### Crear las tablas en orden:

```sql
-- 1. Primero tbl_roles (sin dependencias)
-- 2. Luego tbl_usuarios (depende de tbl_roles y tbl_tenants)
-- 3. Después tbl_permisos
-- 4. Finalmente tbl_rol_permisos
```

### Script de migración completo:

```sql
-- Ver archivo: /migrations/V3__create_usuarios_roles.sql
```

## Consideraciones de Seguridad

1. **Passwords**: Usar bcrypt o Argon2 para hashear contraseñas
2. **Tokens de sesión**: Implementar JWT con refresh tokens
3. **Intentos fallidos**: Bloquear cuenta después de N intentos
4. **Auditoría**: Registrar todos los cambios en usuarios y permisos
5. **Tenant isolation**: Asegurar que los usuarios solo vean datos de su tenant

## Integración con el Frontend

El componente de usuarios ya está configurado para trabajar con esta estructura:

- `usuarios.ts` - Maneja la lógica de listado y filtrado
- `usuario-dialog.ts` - Formulario para crear/editar con selección de rol y tenant
- Los roles se obtienen dinámicamente y se asignan al usuario
- El filtro por rol permite agrupar usuarios fácilmente
