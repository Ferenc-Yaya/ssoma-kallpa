-- ===========================================================================
-- Script SQL Maestro SSOMA Platform v1.0
-- Base de Datos: ssoma_db (PostgreSQL 14+)
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- MÓDULO 0: MULTI-TENANCY (tbl_tenants)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_tenants (
    tenant_id VARCHAR(50) PRIMARY KEY,
    nombre_empresa VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'FREE',
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    config JSONB
);

-- Insertar tenants por defecto
INSERT INTO tbl_tenants (tenant_id, nombre_empresa, plan, activo)
VALUES
    ('SYSTEM', 'Sistema Central', 'ENTERPRISE', TRUE),
    ('KALLPA', 'Kallpa SAC', 'ENTERPRISE', TRUE)
ON CONFLICT (tenant_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- MÓDULO 1: EMPRESAS Y CONTACTOS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cat_tipos_contratista (
    tipo_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id)
);

-- Insertar tipos de contratista por defecto
INSERT INTO cat_tipos_contratista (tenant_id, nombre, descripcion)
VALUES
    ('KALLPA', 'HOST', 'Empresa principal dueña del sistema'),
    ('KALLPA', 'permanentes', 'Contratistas permanentes con contrato vigente de largo plazo'),
    ('KALLPA', 'eventuales', 'Contratistas eventuales o temporales para proyectos específicos'),
    ('KALLPA', 'visitas', 'Visitantes o personal externo temporal sin contrato formal')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS tbl_empresas (
    empresa_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    ruc VARCHAR(11) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    tipo_contratista_id INT,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    FOREIGN KEY (tipo_contratista_id) REFERENCES cat_tipos_contratista(tipo_id)
);

CREATE TABLE IF NOT EXISTS tbl_empresa_contactos (
    contacto_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    empresa_id INT NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    es_principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    FOREIGN KEY (empresa_id) REFERENCES tbl_empresas(empresa_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- MÓDULO 1.5: CONTRATOS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_contratos (
    contrato_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    empresa_id INT NOT NULL,
    numero_contrato VARCHAR(100) UNIQUE NOT NULL,
    numero_oc VARCHAR(100),
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    nivel_riesgo VARCHAR(50) DEFAULT 'MEDIO',
    admin_contrato_kallpa VARCHAR(255),
    monto_total DECIMAL(15,2),
    actividades_criticas JSONB,
    estado VARCHAR(50) DEFAULT 'VIGENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    FOREIGN KEY (empresa_id) REFERENCES tbl_empresas(empresa_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- MÓDULO 1.6: PERSONAS (Trabajadores)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_personas (
    persona_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    empresa_id INT,
    tipo_documento VARCHAR(20) DEFAULT 'DNI',
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    cargo VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    FOREIGN KEY (empresa_id) REFERENCES tbl_empresas(empresa_id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- MÓDULO 2: USUARIOS Y ROLES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_roles (
    rol_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    nombre_rol VARCHAR(100) NOT NULL,
    descripcion TEXT,
    permisos JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    UNIQUE(tenant_id, nombre_rol)
);

CREATE TABLE IF NOT EXISTS tbl_usuarios (
    usuario_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    rol_id INT,
    persona_id INT,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    FOREIGN KEY (rol_id) REFERENCES tbl_roles(rol_id),
    FOREIGN KEY (persona_id) REFERENCES tbl_personas(persona_id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- MÓDULO 3: ACTIVOS (Vehículos y Herramientas)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_activos (
    activo_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    empresa_id INT NOT NULL,
    tipo_activo VARCHAR(50) NOT NULL, -- 'VEHICULO', 'HERRAMIENTA'
    codigo VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    placa VARCHAR(20), -- Solo para vehículos
    serie VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'OPERATIVO',
    metadata JSONB, -- Datos específicos por tipo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    FOREIGN KEY (empresa_id) REFERENCES tbl_empresas(empresa_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tbl_asignaciones (
    asignacion_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    activo_id INT NOT NULL,
    persona_id INT,
    fecha_asignacion DATE NOT NULL,
    fecha_devolucion DATE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    FOREIGN KEY (activo_id) REFERENCES tbl_activos(activo_id) ON DELETE CASCADE,
    FOREIGN KEY (persona_id) REFERENCES tbl_personas(persona_id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- MÓDULO 4: MATERIALES PELIGROSOS (MATPEL)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cat_sustancias_peligrosas (
    sustancia_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    codigo_un VARCHAR(20), -- Código UN de Naciones Unidas
    clase_peligro VARCHAR(50),
    descripcion TEXT,
    hoja_seguridad_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id)
);

CREATE TABLE IF NOT EXISTS tbl_inventario_matpel (
    inventario_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    empresa_id INT NOT NULL,
    sustancia_id INT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    unidad_medida VARCHAR(20),
    ubicacion VARCHAR(255),
    fecha_ingreso DATE NOT NULL,
    lote VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'ALMACENADO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    FOREIGN KEY (empresa_id) REFERENCES tbl_empresas(empresa_id) ON DELETE CASCADE,
    FOREIGN KEY (sustancia_id) REFERENCES cat_sustancias_peligrosas(sustancia_id)
);

-- ---------------------------------------------------------------------------
-- MÓDULO 5: MOTOR DE REGLAS Y CUMPLIMIENTO
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cat_documentos_requeribles (
    documento_requerible_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100), -- 'EMPRESA', 'TRABAJADOR', 'VEHICULO', 'HERRAMIENTA'
    descripcion TEXT,
    obligatorio BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id)
);

CREATE TABLE IF NOT EXISTS tbl_reglas_negocio (
    regla_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    nombre_regla VARCHAR(255) NOT NULL,
    categoria VARCHAR(100), -- 'EMPRESA', 'TRABAJADOR', 'VEHICULO', 'HERRAMIENTA'
    condicion TEXT NOT NULL, -- Expresión lógica de la regla
    color_semaforo VARCHAR(20) NOT NULL, -- 'VERDE', 'AMARILLO', 'ROJO'
    mensaje_alerta TEXT,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id)
);

-- ---------------------------------------------------------------------------
-- MÓDULO 6: GESTIÓN DOCUMENTAL
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tbl_documentos (
    documento_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    entidad_tipo VARCHAR(50) NOT NULL, -- 'EMPRESA', 'PERSONA', 'ACTIVO', 'CONTRATO'
    entidad_id INT NOT NULL,
    documento_requerible_id INT,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    fecha_emision DATE,
    fecha_vencimiento DATE,
    estado VARCHAR(50) DEFAULT 'VIGENTE', -- 'VIGENTE', 'VENCIDO', 'POR_VENCER'
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id),
    FOREIGN KEY (documento_requerible_id) REFERENCES cat_documentos_requeribles(documento_requerible_id)
);

CREATE TABLE IF NOT EXISTS tbl_estado_cumplimiento (
    cumplimiento_id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    entidad_tipo VARCHAR(50) NOT NULL,
    entidad_id INT NOT NULL,
    color_semaforo VARCHAR(20) NOT NULL, -- 'VERDE', 'AMARILLO', 'ROJO'
    documentos_faltantes INT DEFAULT 0,
    documentos_vencidos INT DEFAULT 0,
    documentos_vigentes INT DEFAULT 0,
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detalles JSONB,
    FOREIGN KEY (tenant_id) REFERENCES tbl_tenants(tenant_id)
);

-- ===========================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ===========================================================================
CREATE INDEX IF NOT EXISTS idx_empresas_tenant ON tbl_empresas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_empresas_ruc ON tbl_empresas(ruc);
CREATE INDEX IF NOT EXISTS idx_contratos_tenant ON tbl_contratos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contratos_empresa ON tbl_contratos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_personas_tenant ON tbl_personas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_personas_documento ON tbl_personas(numero_documento);
CREATE INDEX IF NOT EXISTS idx_activos_tenant ON tbl_activos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_activos_empresa ON tbl_activos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_documentos_tenant ON tbl_documentos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documentos_entidad ON tbl_documentos(entidad_tipo, entidad_id);

-- ===========================================================================
-- FIN DEL SCRIPT
-- ===========================================================================