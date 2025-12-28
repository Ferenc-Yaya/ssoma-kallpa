-- ==================================================================================
-- Script para RECREAR la base de datos SSOMA con esquema UUID
-- ==================================================================================

-- Terminar todas las conexiones a la base de datos
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'ssoma_db' AND pid <> pg_backend_pid();

-- Borrar la base de datos existente
DROP DATABASE IF EXISTS ssoma_db;

-- Crear la base de datos nueva
CREATE DATABASE ssoma_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Mensaje de confirmación
\echo 'Base de datos ssoma_db recreada exitosamente!'
\echo 'Ahora inicia el servicio identity-service para que Flyway ejecute las migraciones.'
