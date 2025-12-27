-- Script para insertar datos manualmente si Flyway no los cargó
-- Ejecutar directamente en la base de datos

-- Verificar primero si ya existen datos
SELECT COUNT(*) as total_empresas FROM tbl_empresas WHERE tenant_id = 'KALLPA';

-- Si el resultado es 0, ejecutar los siguientes INSERT:

-- 1. Tipos de Contratista
INSERT INTO cat_tipos_contratista (tenant_id, nombre, descripcion, created_at)
VALUES
    ('KALLPA', 'Contratista Minero', 'Empresas dedicadas a operaciones mineras', CURRENT_TIMESTAMP),
    ('KALLPA', 'Contratista de Transporte', 'Empresas de transporte de materiales y personal', CURRENT_TIMESTAMP),
    ('KALLPA', 'Contratista de Servicios', 'Empresas de servicios generales', CURRENT_TIMESTAMP),
    ('KALLPA', 'Contratista de Construcción', 'Empresas de construcción y obras civiles', CURRENT_TIMESTAMP),
    ('KALLPA', 'Contratista Especializado', 'Empresas con servicios especializados técnicos', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 2. Empresas
INSERT INTO tbl_empresas (tenant_id, ruc, razon_social, tipo_contratista_id, direccion, telefono, email, estado, created_at)
VALUES
    ('KALLPA', '20512345678', 'MINERA DEL SUR SAC',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'Contratista Minero' AND tenant_id = 'KALLPA' LIMIT 1),
     'Av. Los Mineros 456, Arequipa', '054-234567', 'contacto@mineradelsur.com', 'ACTIVO', CURRENT_TIMESTAMP),

    ('KALLPA', '20523456789', 'TRANSPORTES ANDINOS EIRL',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'Contratista de Transporte' AND tenant_id = 'KALLPA' LIMIT 1),
     'Jr. Transporte 789, Cusco', '084-345678', 'ventas@transportesandinos.com', 'ACTIVO', CURRENT_TIMESTAMP),

    ('KALLPA', '20534567890', 'SERVICIOS INTEGRALES PERU SAC',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'Contratista de Servicios' AND tenant_id = 'KALLPA' LIMIT 1),
     'Av. Industrial 321, Lima', '01-4567890', 'info@serviciosintegrales.com', 'ACTIVO', CURRENT_TIMESTAMP),

    ('KALLPA', '20545678901', 'CONSTRUCTORA PACÍFICO SAC',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'Contratista de Construcción' AND tenant_id = 'KALLPA' LIMIT 1),
     'Calle Las Obras 654, Tacna', '052-456789', 'proyectos@constructorapacifico.com', 'ACTIVO', CURRENT_TIMESTAMP),

    ('KALLPA', '20556789012', 'INGENIERÍA ESPECIALIZADA DEL PERÚ SA',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'Contratista Especializado' AND tenant_id = 'KALLPA' LIMIT 1),
     'Av. Técnica 987, Puno', '051-567890', 'contacto@ingenieriaep.com', 'ACTIVO', CURRENT_TIMESTAMP)
ON CONFLICT (ruc) DO NOTHING;

-- Verificar que se insertaron
SELECT empresa_id, ruc, razon_social, estado FROM tbl_empresas WHERE tenant_id = 'KALLPA';
