-- ===========================================================================
-- Script de Datos de Prueba - Sistema SSOMA Completo
-- Versión: V2.0
-- Descripción: Datos de prueba para todas las tablas del sistema
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- MÓDULO 1: EMPRESA PRINCIPAL (HOST)
-- ---------------------------------------------------------------------------
INSERT INTO tbl_empresas (tenant_id, ruc, razon_social, tipo_contratista_id, direccion, telefono, email, estado, created_at)
VALUES
    ('KALLPA', '20123456789', 'KALLPA SAC',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'HOST' AND tenant_id = 'KALLPA'),
     'Av. Principal Kallpa, Lima', '01-1234567', 'contacto@kallpa.com', 'ACTIVO', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 2: EMPRESAS CONTRATISTAS
-- ---------------------------------------------------------------------------
INSERT INTO tbl_empresas (tenant_id, ruc, razon_social, tipo_contratista_id, direccion, telefono, email, estado, created_at)
VALUES
    ('KALLPA', '20512345678', 'MINERA DEL SUR SAC',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'permanentes' AND tenant_id = 'KALLPA'),
     'Av. Los Mineros 456, Arequipa', '054-234567', 'contacto@mineradelsur.com', 'ACTIVO', CURRENT_TIMESTAMP),

    ('KALLPA', '20523456789', 'TRANSPORTES ANDINOS EIRL',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'permanentes' AND tenant_id = 'KALLPA'),
     'Jr. Transporte 789, Cusco', '084-345678', 'ventas@transportesandinos.com', 'ACTIVO', CURRENT_TIMESTAMP),

    ('KALLPA', '20534567890', 'SERVICIOS INTEGRALES PERU SAC',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'eventuales' AND tenant_id = 'KALLPA'),
     'Av. Industrial 321, Lima', '01-4567890', 'info@serviciosintegrales.com', 'ACTIVO', CURRENT_TIMESTAMP),

    ('KALLPA', '20545678901', 'CONSTRUCTORA PACÍFICO SAC',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'eventuales' AND tenant_id = 'KALLPA'),
     'Calle Las Obras 654, Tacna', '052-456789', 'proyectos@constructorapacifico.com', 'ACTIVO', CURRENT_TIMESTAMP),

    ('KALLPA', '20556789012', 'INGENIERÍA ESPECIALIZADA DEL PERÚ SA',
     (SELECT tipo_id FROM cat_tipos_contratista WHERE nombre = 'permanentes' AND tenant_id = 'KALLPA'),
     'Av. Técnica 987, Puno', '051-567890', 'contacto@ingenieriaep.com', 'ACTIVO', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 3: CONTACTOS DE EMPRESAS
-- ---------------------------------------------------------------------------
INSERT INTO tbl_empresa_contactos (tenant_id, empresa_id, nombre_completo, cargo, telefono, email, es_principal, created_at)
VALUES
    -- Contactos MINERA DEL SUR SAC
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     'Carlos Mendoza Ríos', 'Gerente General', '987654321', 'cmendoza@mineradelsur.com', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     'Ana Torres Vega', 'Jefe de SSOMA', '987654322', 'atorres@mineradelsur.com', FALSE, CURRENT_TIMESTAMP),

    -- Contactos TRANSPORTES ANDINOS EIRL
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20523456789'),
     'Roberto Chávez Luna', 'Gerente de Operaciones', '987654323', 'rchavez@transportesandinos.com', TRUE, CURRENT_TIMESTAMP),

    -- Contactos SERVICIOS INTEGRALES PERU SAC
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20534567890'),
     'María Gonzales Pérez', 'Gerente Administrativa', '987654324', 'mgonzales@serviciosintegrales.com', TRUE, CURRENT_TIMESTAMP),

    -- Contactos CONSTRUCTORA PACÍFICO SAC
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20545678901'),
     'Luis Fernández Castro', 'Gerente de Proyectos', '987654325', 'lfernandez@constructorapacifico.com', TRUE, CURRENT_TIMESTAMP),

    -- Contactos INGENIERÍA ESPECIALIZADA DEL PERÚ SA
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20556789012'),
     'Patricia Rojas Díaz', 'Directora Técnica', '987654326', 'projas@ingenieriaep.com', TRUE, CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 4: CONTRATOS
-- ---------------------------------------------------------------------------
INSERT INTO tbl_contratos (tenant_id, empresa_id, numero_contrato, numero_oc, descripcion, fecha_inicio, fecha_fin, nivel_riesgo, admin_contrato_kallpa, monto_total, estado, created_at)
VALUES
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     'CONT-2024-001', 'OC-2024-0156', 'Extracción de mineral en zona norte',
     '2024-01-01', '2024-12-31', 'ALTO', 'Juan Pérez Rojas', 2500000.00, 'VIGENTE', CURRENT_TIMESTAMP),

    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20523456789'),
     'CONT-2024-002', 'OC-2024-0157', 'Transporte de personal y materiales',
     '2024-02-01', '2025-01-31', 'MEDIO', 'María López Silva', 850000.00, 'VIGENTE', CURRENT_TIMESTAMP),

    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20534567890'),
     'CONT-2024-003', 'OC-2024-0158', 'Servicios de alimentación y limpieza',
     '2024-01-15', '2024-12-31', 'BAJO', 'Carlos Ramírez Gómez', 450000.00, 'VIGENTE', CURRENT_TIMESTAMP),

    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20545678901'),
     'CONT-2024-004', 'OC-2024-0159', 'Construcción de campamento minero',
     '2024-03-01', '2024-09-30', 'ALTO', 'Ana Torres Mendoza', 1800000.00, 'VIGENTE', CURRENT_TIMESTAMP),

    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20556789012'),
     'CONT-2024-005', 'OC-2024-0160', 'Mantenimiento de equipos especializados',
     '2024-01-01', '2024-12-31', 'MEDIO', 'Pedro Sánchez Vega', 620000.00, 'VIGENTE', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 5: PERSONAS (TRABAJADORES)
-- ---------------------------------------------------------------------------
INSERT INTO tbl_personas (tenant_id, empresa_id, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, telefono, email, cargo, estado, created_at)
VALUES
    -- Trabajadores de MINERA DEL SUR SAC
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     'DNI', '45678901', 'Juan Carlos', 'Mamani Quispe', '1985-03-15', '987111222', 'jmamani@mineradelsur.com', 'Operador de Maquinaria', 'ACTIVO', CURRENT_TIMESTAMP),
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     'DNI', '45678902', 'Rosa María', 'Condori Apaza', '1990-07-22', '987111223', 'rcondori@mineradelsur.com', 'Ingeniera de Seguridad', 'ACTIVO', CURRENT_TIMESTAMP),
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     'DNI', '45678903', 'Pedro Luis', 'Huamán Castro', '1988-11-10', '987111224', 'phuaman@mineradelsur.com', 'Supervisor de Operaciones', 'ACTIVO', CURRENT_TIMESTAMP),

    -- Trabajadores de TRANSPORTES ANDINOS EIRL
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20523456789'),
     'DNI', '45678904', 'Miguel Ángel', 'Flores Ríos', '1982-05-18', '987222333', 'mflores@transportesandinos.com', 'Conductor', 'ACTIVO', CURRENT_TIMESTAMP),
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20523456789'),
     'DNI', '45678905', 'Carmen Elena', 'Vargas Luna', '1992-09-25', '987222334', 'cvargas@transportesandinos.com', 'Coordinadora de Logística', 'ACTIVO', CURRENT_TIMESTAMP),

    -- Trabajadores de SERVICIOS INTEGRALES PERU SAC
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20534567890'),
     'DNI', '45678906', 'José Antonio', 'Ramos Pérez', '1987-12-30', '987333444', 'jramos@serviciosintegrales.com', 'Jefe de Cocina', 'ACTIVO', CURRENT_TIMESTAMP),
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20534567890'),
     'DNI', '45678907', 'Lucía Isabel', 'Morales Díaz', '1995-04-08', '987333445', 'lmorales@serviciosintegrales.com', 'Personal de Limpieza', 'ACTIVO', CURRENT_TIMESTAMP),

    -- Trabajadores de CONSTRUCTORA PACÍFICO SAC
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20545678901'),
     'DNI', '45678908', 'Ricardo Manuel', 'Castro Rojas', '1983-08-14', '987444555', 'rcastro@constructorapacifico.com', 'Maestro de Obra', 'ACTIVO', CURRENT_TIMESTAMP),
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20545678901'),
     'DNI', '45678909', 'Diana Patricia', 'Gutiérrez Soto', '1991-06-20', '987444556', 'dgutierrez@constructorapacifico.com', 'Ingeniera Civil', 'ACTIVO', CURRENT_TIMESTAMP),

    -- Trabajadores de INGENIERÍA ESPECIALIZADA DEL PERÚ SA
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20556789012'),
     'DNI', '45678910', 'Fernando José', 'Salazar Vega', '1986-02-28', '987555666', 'fsalazar@ingenieriaep.com', 'Técnico Electromecánico', 'ACTIVO', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- NOTA: Los ROLES y USUARIOS son creados automáticamente por DataInitializer.java
-- No se incluyen en esta migración para evitar conflictos con contraseñas encriptadas
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- MÓDULO 6: ACTIVOS (VEHÍCULOS Y HERRAMIENTAS)
-- ---------------------------------------------------------------------------
INSERT INTO tbl_activos (tenant_id, empresa_id, tipo_activo, codigo, descripcion, marca, modelo, placa, serie, estado, metadata, created_at)
VALUES
    -- Vehículos de TRANSPORTES ANDINOS EIRL
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20523456789'),
     'VEHICULO', 'VEH-001', 'Camioneta 4x4', 'Toyota', 'Hilux 2023', 'ABC-123', 'SER-TOY-2023-001', 'OPERATIVO',
     '{"capacidad_carga": "1000 kg", "año_fabricacion": 2023, "soat_vencimiento": "2025-06-30"}', CURRENT_TIMESTAMP),

    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20523456789'),
     'VEHICULO', 'VEH-002', 'Camión Volquete', 'Volvo', 'FMX 440', 'XYZ-456', 'SER-VOL-2022-005', 'OPERATIVO',
     '{"capacidad_carga": "15000 kg", "año_fabricacion": 2022, "soat_vencimiento": "2025-03-15"}', CURRENT_TIMESTAMP),

    -- Herramientas de MINERA DEL SUR SAC
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     'HERRAMIENTA', 'HER-001', 'Taladro Neumático', 'Atlas Copco', 'RH 571', NULL, 'SER-ATL-2023-012', 'OPERATIVO',
     '{"tipo": "perforadora", "presion_trabajo": "25 bar"}', CURRENT_TIMESTAMP),

    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     'HERRAMIENTA', 'HER-002', 'Compresor de Aire', 'Ingersoll Rand', 'P375', NULL, 'SER-ING-2021-008', 'MANTENIMIENTO',
     '{"capacidad": "375 CFM", "presion_maxima": "150 PSI"}', CURRENT_TIMESTAMP),

    -- Vehículo de CONSTRUCTORA PACÍFICO SAC
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20545678901'),
     'VEHICULO', 'VEH-003', 'Excavadora', 'Caterpillar', '320D', NULL, 'SER-CAT-2020-015', 'OPERATIVO',
     '{"capacidad_balde": "1.2 m3", "año_fabricacion": 2020}', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 7: ASIGNACIONES DE ACTIVOS
-- ---------------------------------------------------------------------------
INSERT INTO tbl_asignaciones (tenant_id, activo_id, persona_id, fecha_asignacion, fecha_devolucion, observaciones, created_at)
VALUES
    ('KALLPA',
     (SELECT activo_id FROM tbl_activos WHERE codigo = 'VEH-001'),
     (SELECT persona_id FROM tbl_personas WHERE numero_documento = '45678904'),
     '2024-01-15', NULL, 'Asignado para ruta norte', CURRENT_TIMESTAMP),

    ('KALLPA',
     (SELECT activo_id FROM tbl_activos WHERE codigo = 'HER-001'),
     (SELECT persona_id FROM tbl_personas WHERE numero_documento = '45678901'),
     '2024-02-01', NULL, 'Asignado para obra zona 3', CURRENT_TIMESTAMP),

    ('KALLPA',
     (SELECT activo_id FROM tbl_activos WHERE codigo = 'VEH-003'),
     (SELECT persona_id FROM tbl_personas WHERE numero_documento = '45678908'),
     '2024-03-01', NULL, 'Asignado para construcción campamento', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 8: CATÁLOGO DE SUSTANCIAS PELIGROSAS
-- ---------------------------------------------------------------------------
INSERT INTO cat_sustancias_peligrosas (tenant_id, nombre, codigo_un, clase_peligro, descripcion, hoja_seguridad_url, created_at)
VALUES
    ('KALLPA', 'Ácido Sulfúrico', 'UN1830', 'Corrosivo',
     'Líquido incoloro, aceitoso y muy corrosivo. Utilizado en procesos de lixiviación.',
     'https://ejemplo.com/msds/acido-sulfurico.pdf', CURRENT_TIMESTAMP),

    ('KALLPA', 'Cianuro de Sodio', 'UN1689', 'Tóxico',
     'Sólido cristalino blanco. Altamente tóxico. Usado en extracción de oro.',
     'https://ejemplo.com/msds/cianuro-sodio.pdf', CURRENT_TIMESTAMP),

    ('KALLPA', 'Mercurio', 'UN2024', 'Tóxico',
     'Metal líquido plateado. Altamente tóxico para humanos y medio ambiente.',
     'https://ejemplo.com/msds/mercurio.pdf', CURRENT_TIMESTAMP),

    ('KALLPA', 'Ácido Clorhídrico', 'UN1789', 'Corrosivo',
     'Solución acuosa de cloruro de hidrógeno. Corrosivo.',
     'https://ejemplo.com/msds/acido-clorhidrico.pdf', CURRENT_TIMESTAMP),

    ('KALLPA', 'Diesel', 'UN1202', 'Inflamable',
     'Líquido inflamable derivado del petróleo. Combustible.',
     'https://ejemplo.com/msds/diesel.pdf', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 9: INVENTARIO DE MATERIALES PELIGROSOS
-- ---------------------------------------------------------------------------
INSERT INTO tbl_inventario_matpel (tenant_id, empresa_id, sustancia_id, cantidad, unidad_medida, ubicacion, fecha_ingreso, lote, estado, created_at)
VALUES
    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     (SELECT sustancia_id FROM cat_sustancias_peligrosas WHERE nombre = 'Ácido Sulfúrico' AND tenant_id = 'KALLPA'),
     500.00, 'Litros', 'Almacén A-1, Sector Químicos', '2024-01-15', 'LOTE-H2SO4-2024-01', 'ALMACENADO', CURRENT_TIMESTAMP),

    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     (SELECT sustancia_id FROM cat_sustancias_peligrosas WHERE nombre = 'Cianuro de Sodio' AND tenant_id = 'KALLPA'),
     200.00, 'Kilogramos', 'Almacén B-3, Área Restringida', '2024-02-10', 'LOTE-NaCN-2024-02', 'EN_USO', CURRENT_TIMESTAMP),

    ('KALLPA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20523456789'),
     (SELECT sustancia_id FROM cat_sustancias_peligrosas WHERE nombre = 'Diesel' AND tenant_id = 'KALLPA'),
     5000.00, 'Litros', 'Tanque Principal Combustibles', '2024-03-10', 'LOTE-DIESEL-2024-03', 'EN_USO', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 10: CATÁLOGO DE DOCUMENTOS REQUERIBLES
-- ---------------------------------------------------------------------------
INSERT INTO cat_documentos_requeribles (tenant_id, nombre, categoria, descripcion, obligatorio, created_at)
VALUES
    -- Documentos de EMPRESA
    ('KALLPA', 'RUC', 'EMPRESA', 'Registro Único de Contribuyente', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', 'Licencia de Funcionamiento', 'EMPRESA', 'Licencia municipal de funcionamiento', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', 'Póliza de Seguro SCTR', 'EMPRESA', 'Seguro Complementario de Trabajo de Riesgo', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', 'Plan de Seguridad y Salud', 'EMPRESA', 'Plan SSOMA de la empresa', TRUE, CURRENT_TIMESTAMP),

    -- Documentos de TRABAJADOR
    ('KALLPA', 'DNI', 'TRABAJADOR', 'Documento Nacional de Identidad', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', 'Certificado Médico Ocupacional', 'TRABAJADOR', 'Examen médico ocupacional vigente', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', 'Certificado de Capacitación SSOMA', 'TRABAJADOR', 'Capacitación en seguridad y salud', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', 'Antecedentes Penales', 'TRABAJADOR', 'Certificado de antecedentes penales', FALSE, CURRENT_TIMESTAMP),

    -- Documentos de VEHICULO
    ('KALLPA', 'SOAT', 'VEHICULO', 'Seguro Obligatorio de Accidentes de Tránsito', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', 'Revisión Técnica', 'VEHICULO', 'Certificado de revisión técnica vehicular', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', 'Tarjeta de Propiedad', 'VEHICULO', 'Tarjeta de propiedad vehicular', TRUE, CURRENT_TIMESTAMP),

    -- Documentos de HERRAMIENTA
    ('KALLPA', 'Certificado de Calibración', 'HERRAMIENTA', 'Certificado de calibración de equipos', TRUE, CURRENT_TIMESTAMP),
    ('KALLPA', 'Manual de Operación', 'HERRAMIENTA', 'Manual del fabricante', FALSE, CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 11: REGLAS DE NEGOCIO
-- ---------------------------------------------------------------------------
INSERT INTO tbl_reglas_negocio (tenant_id, nombre_regla, categoria, condicion, color_semaforo, mensaje_alerta, activa, created_at)
VALUES
    ('KALLPA', 'Documentos de empresa próximos a vencer', 'EMPRESA',
     'documentos_vigentes < total_documentos_requeridos', 'AMARILLO',
     'La empresa tiene documentos próximos a vencer en los próximos 30 días', TRUE, CURRENT_TIMESTAMP),

    ('KALLPA', 'Documentos de empresa vencidos', 'EMPRESA',
     'documentos_vencidos > 0', 'ROJO',
     'La empresa tiene documentos vencidos y no puede operar', TRUE, CURRENT_TIMESTAMP),

    ('KALLPA', 'Trabajador sin certificado médico', 'TRABAJADOR',
     'certificado_medico = vencido', 'ROJO',
     'El trabajador no puede ingresar sin certificado médico vigente', TRUE, CURRENT_TIMESTAMP),

    ('KALLPA', 'Vehículo sin SOAT vigente', 'VEHICULO',
     'soat = vencido', 'ROJO',
     'El vehículo no puede circular sin SOAT vigente', TRUE, CURRENT_TIMESTAMP),

    ('KALLPA', 'Herramienta sin calibración', 'HERRAMIENTA',
     'certificado_calibracion = vencido', 'AMARILLO',
     'La herramienta requiere calibración', TRUE, CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 12: DOCUMENTOS
-- ---------------------------------------------------------------------------
INSERT INTO tbl_documentos (tenant_id, entidad_tipo, entidad_id, documento_requerible_id, nombre_archivo, ruta_archivo, fecha_emision, fecha_vencimiento, estado, observaciones, created_at)
VALUES
    -- Documentos de EMPRESA
    ('KALLPA', 'EMPRESA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     (SELECT documento_requerible_id FROM cat_documentos_requeribles WHERE nombre = 'RUC' AND tenant_id = 'KALLPA'),
     'RUC_MINERA_DEL_SUR.pdf', '/documentos/empresas/1/ruc.pdf',
     '2023-01-01', NULL, 'VIGENTE', 'RUC vigente', CURRENT_TIMESTAMP),

    ('KALLPA', 'EMPRESA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     (SELECT documento_requerible_id FROM cat_documentos_requeribles WHERE nombre = 'Póliza de Seguro SCTR' AND tenant_id = 'KALLPA'),
     'SCTR_2024.pdf', '/documentos/empresas/1/sctr.pdf',
     '2024-01-01', '2024-12-31', 'VIGENTE', 'Póliza vigente todo el año', CURRENT_TIMESTAMP),

    -- Documentos de TRABAJADOR
    ('KALLPA', 'PERSONA', (SELECT persona_id FROM tbl_personas WHERE numero_documento = '45678901'),
     (SELECT documento_requerible_id FROM cat_documentos_requeribles WHERE nombre = 'DNI' AND tenant_id = 'KALLPA'),
     'DNI_45678901.pdf', '/documentos/personas/1/dni.pdf',
     '2023-01-15', NULL, 'VIGENTE', 'DNI vigente', CURRENT_TIMESTAMP),

    ('KALLPA', 'PERSONA', (SELECT persona_id FROM tbl_personas WHERE numero_documento = '45678901'),
     (SELECT documento_requerible_id FROM cat_documentos_requeribles WHERE nombre = 'Certificado Médico Ocupacional' AND tenant_id = 'KALLPA'),
     'EMO_45678901_2024.pdf', '/documentos/personas/1/emo.pdf',
     '2024-01-10', '2025-01-10', 'VIGENTE', 'Apto para trabajo en altura', CURRENT_TIMESTAMP),

    -- Documentos de VEHICULO
    ('KALLPA', 'ACTIVO', (SELECT activo_id FROM tbl_activos WHERE codigo = 'VEH-001'),
     (SELECT documento_requerible_id FROM cat_documentos_requeribles WHERE nombre = 'SOAT' AND tenant_id = 'KALLPA'),
     'SOAT_ABC123_2024.pdf', '/documentos/activos/1/soat.pdf',
     '2024-01-01', '2025-01-01', 'VIGENTE', 'SOAT vigente', CURRENT_TIMESTAMP);

-- ---------------------------------------------------------------------------
-- MÓDULO 13: ESTADO DE CUMPLIMIENTO
-- ---------------------------------------------------------------------------
INSERT INTO tbl_estado_cumplimiento (tenant_id, entidad_tipo, entidad_id, color_semaforo, documentos_faltantes, documentos_vencidos, documentos_vigentes, fecha_evaluacion, detalles)
VALUES
    -- Estado de cumplimiento EMPRESA
    ('KALLPA', 'EMPRESA', (SELECT empresa_id FROM tbl_empresas WHERE ruc = '20512345678'),
     'VERDE', 0, 0, 2, CURRENT_TIMESTAMP,
     '{"estado_general": "cumple", "observaciones": "Todos los documentos en orden"}'),

    -- Estado de cumplimiento TRABAJADOR
    ('KALLPA', 'PERSONA', (SELECT persona_id FROM tbl_personas WHERE numero_documento = '45678901'),
     'VERDE', 0, 0, 2, CURRENT_TIMESTAMP,
     '{"estado_general": "cumple", "observaciones": "Apto para trabajar"}'),

    -- Estado de cumplimiento VEHICULO
    ('KALLPA', 'ACTIVO', (SELECT activo_id FROM tbl_activos WHERE codigo = 'VEH-001'),
     'VERDE', 0, 0, 1, CURRENT_TIMESTAMP,
     '{"estado_general": "cumple", "observaciones": "Vehículo operativo"}');

-- ===========================================================================
-- FIN DEL SCRIPT DE DATOS DE PRUEBA
-- ===========================================================================
