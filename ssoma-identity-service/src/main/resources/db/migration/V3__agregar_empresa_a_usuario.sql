-- ==================================================================================
-- MIGRACIÓN V3: Agregar empresa_id a usuarios
-- Permite asociar un usuario contratista con su empresa específica
-- ==================================================================================

-- Agregar columna empresa_id a la tabla de usuarios
ALTER TABLE tbl_usuarios
ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES tbl_empresas(empresa_id);

-- Crear índice para mejorar rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_usuarios_empresa_id ON tbl_usuarios(empresa_id);

-- ==================================================================================
-- Asociar usuarios contratistas con sus empresas
-- ==================================================================================

-- jperez -> Constructora Andina S.A.C.
UPDATE tbl_usuarios u
SET empresa_id = e.empresa_id
FROM tbl_empresas e
WHERE u.username = 'jperez'
  AND e.ruc = '20456789123';

-- mgarcia -> Instalaciones Eléctricas del Sur S.A.
UPDATE tbl_usuarios u
SET empresa_id = e.empresa_id
FROM tbl_empresas e
WHERE u.username = 'mgarcia'
  AND e.ruc = '20678912345';

-- ==================================================================================
-- FIN MIGRACIÓN V3
-- ==================================================================================
