-- Script para verificar datos en la base de datos
-- Ejecutar con: psql -h localhost -U postgres -d ssoma_db -f verificar_datos.sql

-- 1. Verificar migraciones de Flyway
SELECT * FROM flyway_schema_history ORDER BY installed_rank;

-- 2. Verificar tenants
SELECT * FROM tbl_tenants;

-- 3. Verificar empresas
SELECT empresa_id, tenant_id, ruc, razon_social, estado
FROM tbl_empresas
ORDER BY empresa_id;

-- 4. Contar registros por tabla
SELECT 'tbl_empresas' as tabla, COUNT(*) as total FROM tbl_empresas
UNION ALL
SELECT 'tbl_personas', COUNT(*) FROM tbl_personas
UNION ALL
SELECT 'tbl_contratos', COUNT(*) FROM tbl_contratos
UNION ALL
SELECT 'tbl_activos', COUNT(*) FROM tbl_activos
UNION ALL
SELECT 'cat_sustancias_peligrosas', COUNT(*) FROM cat_sustancias_peligrosas
UNION ALL
SELECT 'tbl_inventario_matpel', COUNT(*) FROM tbl_inventario_matpel;
