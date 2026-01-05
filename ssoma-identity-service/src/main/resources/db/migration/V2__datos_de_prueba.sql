-- ==================================================================================
-- MIGRACIÓN V2: Datos de Prueba Iniciales
-- Incluye: Tenants, Tipos de Contratista, Empresas Principales, Sedes, Contratistas y Roles
-- ==================================================================================

-- ==================================================================================
-- TENANTS INICIALES (Solo namespaces)
-- ==================================================================================
INSERT INTO tbl_tenants (tenant_id, activo)
VALUES
    ('SYSTEM', TRUE),
    ('KALLPA', TRUE),
    ('LUZDELSUR', TRUE)
ON CONFLICT (tenant_id) DO NOTHING;

-- ==================================================================================
-- TIPOS DE CONTRATISTA
-- ==================================================================================
INSERT INTO cat_tipos_contratista (tipo_id, tenant_id, codigo, nombre, descripcion)
VALUES
    (gen_random_uuid(), 'SYSTEM', 'HOST', 'Empresa Principal', 'Empresa principal dueña del sistema'),
    (gen_random_uuid(), 'SYSTEM', 'PERMANENTE', 'Contratista Permanente', 'Contratistas permanentes con contrato vigente de largo plazo'),
    (gen_random_uuid(), 'SYSTEM', 'EVENTUAL', 'Contratista Eventual', 'Contratistas eventuales o temporales para proyectos específicos'),
    (gen_random_uuid(), 'SYSTEM', 'VISITA', 'Visitante', 'Visitantes o personal externo temporal sin contrato formal')
ON CONFLICT (codigo) DO NOTHING;

-- ==================================================================================
-- EMPRESAS PRINCIPALES (tipo='HOST')
-- ==================================================================================

-- Empresa principal KALLPA
INSERT INTO tbl_empresas (empresa_id, tenant_id, ruc, razon_social, tipo_id, direccion, telefono, email, logo_url, sitio_web, rubro_comercial, score_seguridad, activo)
SELECT
    gen_random_uuid(),
    'KALLPA',
    '20123456789',
    'Kallpa Generación S.A.',
    tipo_id,
    'Av. Jorge Basadre 592, San Isidro, Lima',
    '+51 1 612-8585',
    'contacto@kallpa.com.pe',
    'https://via.placeholder.com/150/2196F3/FFFFFF?text=KALLPA',
    'https://www.kallpa.com.pe',
    'Generación de Energía Eléctrica',
    95,
    TRUE
FROM cat_tipos_contratista
WHERE codigo = 'HOST'
ON CONFLICT (tenant_id, ruc) DO NOTHING;

-- Empresa principal LUZ DEL SUR
INSERT INTO tbl_empresas (empresa_id, tenant_id, ruc, razon_social, tipo_id, direccion, telefono, email, logo_url, sitio_web, rubro_comercial, score_seguridad, activo)
SELECT
    gen_random_uuid(),
    'LUZDELSUR',
    '20331898008',
    'Luz del Sur S.A.A.',
    tipo_id,
    'Av. Canaval y Moreyra 380, San Isidro, Lima',
    '+51 1 617-5000',
    'contacto@luzdelsur.com.pe',
    'https://via.placeholder.com/150/FF9800/FFFFFF?text=LUZ',
    'https://www.luzdelsur.com.pe',
    'Distribución de Energía Eléctrica',
    92,
    TRUE
FROM cat_tipos_contratista
WHERE codigo = 'HOST'
ON CONFLICT (tenant_id, ruc) DO NOTHING;

-- ==================================================================================
-- SEDES DE EMPRESAS PRINCIPALES
-- ==================================================================================

-- Sedes para KALLPA
INSERT INTO tbl_sedes (sede_id, tenant_id, empresa_id, nombre, direccion, es_principal, activo)
SELECT
    gen_random_uuid(),
    'KALLPA',
    e.empresa_id,
    'Cañón del Pato',
    'Central Hidroeléctrica Cañón del Pato, Santa Cruz, Áncash',
    TRUE,
    TRUE
FROM tbl_empresas e
WHERE e.ruc = '20123456789';

INSERT INTO tbl_sedes (sede_id, tenant_id, empresa_id, nombre, direccion, es_principal, activo)
SELECT
    gen_random_uuid(),
    'KALLPA',
    e.empresa_id,
    'Cerro del Águila',
    'Central Hidroeléctrica Cerro del Águila, Colcabamba, Huancavelica',
    FALSE,
    TRUE
FROM tbl_empresas e
WHERE e.ruc = '20123456789';

-- Sedes para LUZ DEL SUR
INSERT INTO tbl_sedes (sede_id, tenant_id, empresa_id, nombre, direccion, es_principal, activo)
SELECT
    gen_random_uuid(),
    'LUZDELSUR',
    e.empresa_id,
    'Lima',
    'Av. Canaval y Moreyra 380, San Isidro, Lima',
    TRUE,
    TRUE
FROM tbl_empresas e
WHERE e.ruc = '20331898008';

INSERT INTO tbl_sedes (sede_id, tenant_id, empresa_id, nombre, direccion, es_principal, activo)
SELECT
    gen_random_uuid(),
    'LUZDELSUR',
    e.empresa_id,
    'Cañete',
    'Av. Bolognesi 450, San Vicente de Cañete',
    FALSE,
    TRUE
FROM tbl_empresas e
WHERE e.ruc = '20331898008';

-- ==================================================================================
-- EMPRESAS CONTRATISTAS
-- ==================================================================================

-- Contratistas para KALLPA (2 empresas)
INSERT INTO tbl_empresas (empresa_id, tenant_id, ruc, razon_social, tipo_id, direccion, telefono, email, sitio_web, rubro_comercial, score_seguridad, activo)
SELECT
    gen_random_uuid(),
    'KALLPA',
    '20456789123',
    'Constructora Andina S.A.C.',
    tipo_id,
    'Jr. Los Ingenieros 245, Miraflores, Lima',
    '+51 1 445-6789',
    'ventas@constructoraandina.com',
    'https://www.constructoraandina.com',
    'Construcción y Mantenimiento Industrial',
    88,
    TRUE
FROM cat_tipos_contratista
WHERE codigo = 'PERMANENTE'
ON CONFLICT (tenant_id, ruc) DO NOTHING;

INSERT INTO tbl_empresas (empresa_id, tenant_id, ruc, razon_social, tipo_id, direccion, telefono, email, sitio_web, rubro_comercial, score_seguridad, activo)
SELECT
    gen_random_uuid(),
    'KALLPA',
    '20567891234',
    'Servicios Técnicos Huascarán E.I.R.L.',
    tipo_id,
    'Av. Industrial 890, Independencia, Lima',
    '+51 1 533-2211',
    'contacto@huascaran.pe',
    'https://www.huascaran.pe',
    'Servicios de Mantenimiento Eléctrico',
    75,
    TRUE
FROM cat_tipos_contratista
WHERE codigo = 'EVENTUAL'
ON CONFLICT (tenant_id, ruc) DO NOTHING;

-- Contratistas para LUZ DEL SUR (2 empresas)
INSERT INTO tbl_empresas (empresa_id, tenant_id, ruc, razon_social, tipo_id, direccion, telefono, email, sitio_web, rubro_comercial, score_seguridad, activo)
SELECT
    gen_random_uuid(),
    'LUZDELSUR',
    '20678912345',
    'Instalaciones Eléctricas del Sur S.A.',
    tipo_id,
    'Av. Tomás Marsano 2850, Surquillo, Lima',
    '+51 1 275-8844',
    'info@ielectricas.com.pe',
    'https://www.ielectricas.com.pe',
    'Instalaciones Eléctricas Residenciales',
    90,
    TRUE
FROM cat_tipos_contratista
WHERE codigo = 'PERMANENTE'
ON CONFLICT (tenant_id, ruc) DO NOTHING;

INSERT INTO tbl_empresas (empresa_id, tenant_id, ruc, razon_social, tipo_id, direccion, telefono, email, sitio_web, rubro_comercial, score_seguridad, activo)
SELECT
    gen_random_uuid(),
    'LUZDELSUR',
    '20789123456',
    'Grupo Mantto Perú S.R.L.',
    tipo_id,
    'Jr. Las Palmeras 156, Villa El Salvador, Lima',
    '+51 1 287-9933',
    'ventas@manttoperu.com',
    'https://www.manttoperu.com',
    'Mantenimiento de Redes Eléctricas',
    82,
    TRUE
FROM cat_tipos_contratista
WHERE codigo = 'EVENTUAL'
ON CONFLICT (tenant_id, ruc) DO NOTHING;

-- ==================================================================================
-- CONTACTOS DE EMPRESAS
-- ==================================================================================

-- Contactos para Kallpa Generación
INSERT INTO tbl_empresa_contactos (contacto_id, tenant_id, empresa_id, nombre_completo, cargo, tipo_contacto, telefono, email, es_principal)
SELECT
    gen_random_uuid(),
    'KALLPA',
    e.empresa_id,
    'Carlos Mendoza Rojas',
    'Gerente General',
    'GERENCIAL',
    '+51 999 888 777',
    'cmendoza@kallpa.com.pe',
    TRUE
FROM tbl_empresas e
WHERE e.ruc = '20123456789';

INSERT INTO tbl_empresa_contactos (contacto_id, tenant_id, empresa_id, nombre_completo, cargo, tipo_contacto, telefono, email, es_principal)
SELECT
    gen_random_uuid(),
    'KALLPA',
    e.empresa_id,
    'Ana López García',
    'Jefe de SSOMA',
    'TECNICO',
    '+51 988 777 666',
    'alopez@kallpa.com.pe',
    FALSE
FROM tbl_empresas e
WHERE e.ruc = '20123456789';

-- Contactos para Luz del Sur
INSERT INTO tbl_empresa_contactos (contacto_id, tenant_id, empresa_id, nombre_completo, cargo, tipo_contacto, telefono, email, es_principal)
SELECT
    gen_random_uuid(),
    'LUZDELSUR',
    e.empresa_id,
    'Roberto Castillo Pérez',
    'Gerente de Operaciones',
    'GERENCIAL',
    '+51 977 666 555',
    'rcastillo@luzdelsur.com.pe',
    TRUE
FROM tbl_empresas e
WHERE e.ruc = '20331898008';

INSERT INTO tbl_empresa_contactos (contacto_id, tenant_id, empresa_id, nombre_completo, cargo, tipo_contacto, telefono, email, es_principal)
SELECT
    gen_random_uuid(),
    'LUZDELSUR',
    e.empresa_id,
    'María Torres Sánchez',
    'Coordinadora de Seguridad',
    'TECNICO',
    '+51 966 555 444',
    'mtorres@luzdelsur.com.pe',
    FALSE
FROM tbl_empresas e
WHERE e.ruc = '20331898008';

-- ==================================================================================
-- ROLES DEL SISTEMA
-- ==================================================================================
INSERT INTO tbl_roles (rol_id, tenant_id, codigo, nombre_rol, descripcion, nivel_jerarquia, requiere_tenant, activo)
VALUES
    (gen_random_uuid(), 'SYSTEM', 'SUPER_ADMIN', 'Super Administrador', 'Acceso completo al sistema, gestiona todas las empresas principales', 1, FALSE, TRUE),
    (gen_random_uuid(), 'SYSTEM', 'ADMIN_EMPRESA_PRINCIPAL', 'Admin Empresa Principal', 'Administra una empresa principal y sus contratistas', 2, TRUE, TRUE),
    (gen_random_uuid(), 'SYSTEM', 'ADMIN_CONTRATISTA', 'Admin Contratista', 'Administra una empresa contratista y su personal', 3, TRUE, TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- ==================================================================================
-- USUARIOS DE PRUEBA
-- ==================================================================================

-- Usuario Admin KALLPA (para testing) - password: admin123
INSERT INTO tbl_usuarios (usuario_id, tenant_id, username, password_hash, nombre_completo, email, rol_id, activo)
SELECT
    gen_random_uuid(),
    'KALLPA',
    'admin.kallpa',
    '$2a$10$5m1NfoRE.dNZ8VfOqIOeSOROp7pgUMNyuv/GYdK8FOhqLsj.fSQbW',
    'Administrador KALLPA',
    'admin@kallpa.com.pe',
    rol_id,
    TRUE
FROM tbl_roles
WHERE codigo = 'ADMIN_EMPRESA_PRINCIPAL'
ON CONFLICT (tenant_id, username) DO NOTHING;

-- Usuario Admin LUZ DEL SUR (para testing) - password: admin123
INSERT INTO tbl_usuarios (usuario_id, tenant_id, username, password_hash, nombre_completo, email, rol_id, activo)
SELECT
    gen_random_uuid(),
    'LUZDELSUR',
    'admin.luzdelsur',
    '$2a$10$5m1NfoRE.dNZ8VfOqIOeSOROp7pgUMNyuv/GYdK8FOhqLsj.fSQbW',
    'Administrador Luz del Sur',
    'admin@luzdelsur.com.pe',
    rol_id,
    TRUE
FROM tbl_roles
WHERE codigo = 'ADMIN_EMPRESA_PRINCIPAL'
ON CONFLICT (tenant_id, username) DO NOTHING;

-- Usuario Contratista en KALLPA (para testing) - password: admin123
INSERT INTO tbl_usuarios (usuario_id, tenant_id, username, password_hash, nombre_completo, email, rol_id, activo)
SELECT
    gen_random_uuid(),
    'KALLPA',
    'jperez',
    '$2a$10$5m1NfoRE.dNZ8VfOqIOeSOROp7pgUMNyuv/GYdK8FOhqLsj.fSQbW',
    'Juan Pérez Rojas',
    'jperez@constructoraandina.com',
    rol_id,
    TRUE
FROM tbl_roles
WHERE codigo = 'ADMIN_CONTRATISTA'
ON CONFLICT (tenant_id, username) DO NOTHING;

-- Usuario Contratista en LUZ DEL SUR (para testing) - password: admin123
INSERT INTO tbl_usuarios (usuario_id, tenant_id, username, password_hash, nombre_completo, email, rol_id, activo)
SELECT
    gen_random_uuid(),
    'LUZDELSUR',
    'mgarcia',
    '$2a$10$5m1NfoRE.dNZ8VfOqIOeSOROp7pgUMNyuv/GYdK8FOhqLsj.fSQbW',
    'María García Silva',
    'mgarcia@ielectricas.com.pe',
    rol_id,
    TRUE
FROM tbl_roles
WHERE codigo = 'ADMIN_CONTRATISTA'
ON CONFLICT (tenant_id, username) DO NOTHING;

-- ==================================================================================
-- FIN MIGRACIÓN V2
-- ==================================================================================
