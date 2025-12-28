-- ==================================================================================
-- MIGRACIÓN V2: Datos de Prueba Iniciales
-- Incluye: Tenants, Tipos de Contratista y Roles del Sistema
-- ==================================================================================

-- ==================================================================================
-- TENANTS INICIALES
-- ==================================================================================
INSERT INTO tbl_tenants (tenant_id, nombre_comercial, ruc, plan, activo)
VALUES
    ('SYSTEM', 'SSOMA Platform', '00000000000', 'ENTERPRISE', TRUE),
    ('KALLPA', 'KALLPA Security', '20123456789', 'ENTERPRISE', TRUE)
ON CONFLICT (tenant_id) DO NOTHING;

-- ==================================================================================
-- TIPOS DE CONTRATISTA
-- ==================================================================================
INSERT INTO cat_tipos_contratista (tenant_id, codigo, nombre, descripcion)
VALUES
    ('SYSTEM', 'HOST', 'Empresa Principal', 'Empresa principal dueña del sistema'),
    ('SYSTEM', 'PERMANENTE', 'Contratista Permanente', 'Contratistas permanentes con contrato vigente de largo plazo'),
    ('SYSTEM', 'EVENTUAL', 'Contratista Eventual', 'Contratistas eventuales o temporales para proyectos específicos'),
    ('SYSTEM', 'VISITA', 'Visitante', 'Visitantes o personal externo temporal sin contrato formal')
ON CONFLICT (codigo) DO NOTHING;

-- ==================================================================================
-- ROLES DEL SISTEMA
-- ==================================================================================
INSERT INTO tbl_roles (tenant_id, codigo, nombre_rol, descripcion, nivel_jerarquia, requiere_tenant, activo)
VALUES
    ('SYSTEM', 'SUPER_ADMIN', 'Super Administrador', 'Acceso completo al sistema, gestiona todas las empresas principales', 1, FALSE, TRUE),
    ('SYSTEM', 'ADMIN_EMPRESA_PRINCIPAL', 'Admin Empresa Principal', 'Administra una empresa principal y sus contratistas', 2, TRUE, TRUE),
    ('SYSTEM', 'ADMIN_CONTRATISTA', 'Admin Contratista', 'Administra una empresa contratista y su personal', 3, TRUE, TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- ==================================================================================
-- USUARIOS DE PRUEBA
-- ==================================================================================

-- Usuario Admin KALLPA (para testing)
INSERT INTO tbl_usuarios (tenant_id, username, password_hash, nombre_completo, email, rol_id, activo)
SELECT
    'KALLPA',
    'admin.kallpa',
    '$2b$10$M93nN6NBpAVOkmcV4JqzE.jDlcXDDl/wUOlD.T.YGJ7L47zGdMQMe',
    'Administrador KALLPA',
    'admin@kallpa.com',
    rol_id,
    TRUE
FROM tbl_roles
WHERE codigo = 'ADMIN_EMPRESA_PRINCIPAL'
ON CONFLICT (username, tenant_id) DO NOTHING;

-- Usuario Contratista (para testing)
INSERT INTO tbl_usuarios (tenant_id, username, password_hash, nombre_completo, email, rol_id, activo)
SELECT
    'KALLPA',
    'jperez',
    '$2b$10$kxw5bR7Wi/Pt85UxwyOKw.jQa7OUNdc4j//bTjmQSAuwYpAbJsueO',
    'Juan Pérez',
    'jperez@contratista.com',
    rol_id,
    TRUE
FROM tbl_roles
WHERE codigo = 'ADMIN_CONTRATISTA'
ON CONFLICT (username, tenant_id) DO NOTHING;

-- ==================================================================================
-- FIN MIGRACIÓN V2
-- ==================================================================================
