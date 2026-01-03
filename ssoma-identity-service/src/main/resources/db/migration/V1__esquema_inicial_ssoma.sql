-- ==================================================================================
-- MIGRACIÓN V1: Esquema Completo SSOMA con UUID
-- TODAS las tablas usan UUID como PK
-- ==================================================================================

-- Habilitar extensión para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================================================================================
-- MÓDULO 0: TENANTS (Multi-tenancy)
-- ==================================================================================
-- Tenant es solo un namespace/contenedor para aislar datos entre clientes
-- TODOS los datos de negocio están en tbl_empresas (incluida la empresa principal)
CREATE TABLE IF NOT EXISTS tbl_tenants (
    tenant_id VARCHAR(50) PRIMARY KEY,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================================
-- MÓDULO 1: EMPRESAS Y CONTACTOS
-- ==================================================================================

-- Catálogo de Tipos de Contratista
CREATE TABLE IF NOT EXISTS cat_tipos_contratista (
    tipo_id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Empresas
CREATE TABLE IF NOT EXISTS tbl_empresas (
    empresa_id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    ruc VARCHAR(11) NOT NULL,
    razon_social VARCHAR(200) NOT NULL,
    tipo_id UUID REFERENCES cat_tipos_contratista(tipo_id),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100),
    logo_url TEXT,
    sitio_web VARCHAR(100),
    rubro_comercial VARCHAR(100),
    score_seguridad INT DEFAULT 100,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, ruc)
);

-- Sedes de empresas
CREATE TABLE IF NOT EXISTS tbl_sedes (
    sede_id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    empresa_id UUID NOT NULL REFERENCES tbl_empresas(empresa_id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT,
    es_principal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contactos de empresas
CREATE TABLE IF NOT EXISTS tbl_empresa_contactos (
    contacto_id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    empresa_id UUID REFERENCES tbl_empresas(empresa_id) ON DELETE CASCADE,
    nombre_completo VARCHAR(150) NOT NULL,
    cargo VARCHAR(100),
    tipo_contacto VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    telefono VARCHAR(20),
    es_principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================================
-- MÓDULO 1.5: CONTRATOS
-- ==================================================================================
CREATE TABLE IF NOT EXISTS tbl_contratos (
    contrato_id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    empresa_id UUID REFERENCES tbl_empresas(empresa_id) ON DELETE CASCADE,
    numero_contrato VARCHAR(100),
    numero_oc VARCHAR(50) NOT NULL,
    descripcion_servicio TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    nivel_riesgo VARCHAR(50),
    admin_contrato_kallpa VARCHAR(150),
    monto_total DECIMAL(15,2),
    actividades_criticas JSONB,
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, numero_oc)
);

-- ==================================================================================
-- MÓDULO 2: PERSONAS
-- ==================================================================================
CREATE TABLE IF NOT EXISTS tbl_personas (
    persona_id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    empresa_id UUID REFERENCES tbl_empresas(empresa_id),
    contrato_activo_id UUID REFERENCES tbl_contratos(contrato_id),
    tipo_documento VARCHAR(20) DEFAULT 'DNI',
    numero_documento VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    cargo VARCHAR(100) NOT NULL,
    es_conductor BOOLEAN DEFAULT FALSE,
    grupo_sanguineo VARCHAR(10),
    foto_perfil_url TEXT,
    estado_global VARCHAR(20) DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, numero_documento)
);

-- ==================================================================================
-- MÓDULO 3: ROLES Y SEGURIDAD
-- ==================================================================================

-- Tabla de Roles
CREATE TABLE IF NOT EXISTS tbl_roles (
    rol_id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre_rol VARCHAR(100) NOT NULL,
    descripcion TEXT,
    nivel_jerarquia INTEGER,
    requiere_tenant BOOLEAN DEFAULT TRUE,
    permisos JSONB,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, nombre_rol)
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS tbl_usuarios (
    usuario_id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    persona_id UUID REFERENCES tbl_personas(persona_id),
    rol_id UUID REFERENCES tbl_roles(rol_id),
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, username),
    UNIQUE(email)
);

-- ==================================================================================
-- MÓDULO 4: ACTIVOS (Vehículos y Herramientas)
-- ==================================================================================
CREATE TABLE IF NOT EXISTS tbl_activos (
    activo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    empresa_id UUID NOT NULL REFERENCES tbl_empresas(empresa_id) ON DELETE CASCADE,
    tipo_activo VARCHAR(50) NOT NULL,
    codigo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    placa VARCHAR(20),
    serie VARCHAR(100),
    categoria_activo VARCHAR(50) NOT NULL,
    anio_fabricacion INT,
    kilometraje_actual INT,
    tiene_rops BOOLEAN DEFAULT FALSE,
    tiene_fops BOOLEAN DEFAULT FALSE,
    fecha_ultima_calibracion DATE,
    tiene_guardas_seguridad BOOLEAN DEFAULT FALSE,
    sistema_proteccion_fugas BOOLEAN DEFAULT FALSE,
    estado_operativo VARCHAR(20) DEFAULT 'OPERATIVO',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, codigo)
);

CREATE TABLE IF NOT EXISTS tbl_asignaciones (
    asignacion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    activo_id UUID NOT NULL REFERENCES tbl_activos(activo_id) ON DELETE CASCADE,
    persona_id UUID REFERENCES tbl_personas(persona_id) ON DELETE SET NULL,
    fecha_asignacion DATE NOT NULL,
    fecha_devolucion DATE,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'VIGENTE',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================================
-- MÓDULO 5: MATERIALES PELIGROSOS (MATPEL)
-- ==================================================================================
CREATE TABLE IF NOT EXISTS cat_sustancias_peligrosas (
    sustancia_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    nombre_producto VARCHAR(200) NOT NULL,
    marca_fabricante VARCHAR(100) NOT NULL,
    estado_fisico VARCHAR(20),
    nfpa_salud INT DEFAULT 0,
    nfpa_inflamabilidad INT DEFAULT 0,
    nfpa_reactividad INT DEFAULT 0,
    nfpa_riesgo_especifico VARCHAR(10),
    numero_un VARCHAR(50),
    codigo_un VARCHAR(20),
    clase_peligro VARCHAR(50),
    descripcion TEXT,
    hoja_seguridad_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_inventario_matpel (
    inventario_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    empresa_id UUID REFERENCES tbl_empresas(empresa_id) ON DELETE CASCADE,
    sustancia_id UUID REFERENCES cat_sustancias_peligrosas(sustancia_id),
    descripcion_uso TEXT,
    ubicacion_almacenamiento VARCHAR(150),
    cantidad DECIMAL(10,2) NOT NULL,
    cantidad_estimada DECIMAL(10,2),
    unidad_medida VARCHAR(20),
    fecha_ingreso DATE NOT NULL,
    lote VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'ALMACENADO',
    estado_autorizacion VARCHAR(20) DEFAULT 'PENDIENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================================
-- MÓDULO 6: MOTOR DE CUMPLIMIENTO (Reglas)
-- ==================================================================================
CREATE TABLE IF NOT EXISTS cat_documentos_requeribles (
    doc_req_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    codigo_interno VARCHAR(50) UNIQUE NOT NULL,
    nombre_mostrar VARCHAR(100) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    categoria_agrupacion VARCHAR(50),
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_reglas_negocio (
    regla_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    aplicar_a_tipo_empresa UUID REFERENCES cat_tipos_contratista(tipo_id),
    aplicar_a_rol_o_tipo VARCHAR(100),
    entidad_objetivo VARCHAR(20) NOT NULL,
    doc_req_id UUID REFERENCES cat_documentos_requeribles(doc_req_id),
    nombre_regla VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    condicion TEXT NOT NULL,
    dias_vigencia_minima INT DEFAULT 0,
    es_bloqueante BOOLEAN DEFAULT TRUE,
    color_semaforo VARCHAR(20) NOT NULL,
    mensaje_alerta TEXT,
    activa BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuración de requisitos por tipo de contratista
CREATE TABLE IF NOT EXISTS tbl_tipo_contratista_requisitos (
    requisito_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    tipo_contratista_id UUID NOT NULL REFERENCES cat_tipos_contratista(tipo_id),
    categoria_requisito VARCHAR(50) NOT NULL,
    documento_requerible_id UUID NOT NULL REFERENCES cat_documentos_requeribles(doc_req_id),
    obligatorio BOOLEAN DEFAULT TRUE,
    aplica BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tipo_contratista_id, categoria_requisito, documento_requerible_id)
);

-- ==================================================================================
-- MÓDULO 7: DOCUMENTOS Y AUDITORÍA
-- ==================================================================================
CREATE TABLE IF NOT EXISTS tbl_documentos (
    documento_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    entidad_id UUID NOT NULL,
    entidad_tipo VARCHAR(50) NOT NULL,
    doc_req_id UUID REFERENCES cat_documentos_requeribles(doc_req_id),
    nombre_archivo VARCHAR(255) NOT NULL,
    numero_documento VARCHAR(100),
    ruta_archivo VARCHAR(500) NOT NULL,
    archivo_url TEXT NOT NULL,
    fecha_emision DATE,
    fecha_vencimiento DATE,
    estado VARCHAR(50) DEFAULT 'VIGENTE',
    estado_validacion VARCHAR(20) DEFAULT 'PENDIENTE',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tbl_estado_cumplimiento (
    estado_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cumplimiento_id UUID,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tbl_tenants(tenant_id),
    entidad_id UUID NOT NULL,
    entidad_tipo VARCHAR(50) NOT NULL,
    tipo_entidad VARCHAR(20) NOT NULL,
    es_apto BOOLEAN DEFAULT FALSE,
    color_semaforo VARCHAR(20) NOT NULL,
    documentos_faltantes INT DEFAULT 0,
    documentos_vencidos INT DEFAULT 0,
    documentos_vigentes INT DEFAULT 0,
    detalle_json JSONB,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, entidad_id, tipo_entidad)
);

-- ==================================================================================
-- ÍNDICES ADICIONALES
-- ==================================================================================

CREATE INDEX IF NOT EXISTS idx_usuarios_tenant ON tbl_usuarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON tbl_usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_personas_tenant ON tbl_personas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_personas_empresa ON tbl_personas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_empresas_tenant ON tbl_empresas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_roles_tenant ON tbl_roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_activos_tenant ON tbl_activos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_activos_empresa ON tbl_activos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_documentos_tenant ON tbl_documentos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documentos_entidad ON tbl_documentos(entidad_id);
CREATE INDEX IF NOT EXISTS idx_contratos_tenant ON tbl_contratos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contratos_empresa ON tbl_contratos(empresa_id);

-- ==================================================================================
-- FIN MIGRACIÓN V1
-- ==================================================================================
