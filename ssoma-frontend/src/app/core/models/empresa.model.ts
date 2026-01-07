// src/app/core/models/empresa.model.ts

export interface TipoContratista {
    tipoId: string;      // UUID
    tenantId?: string;
    codigo: string;
    nombre: string;
    descripcion?: string;
    createdAt?: string;
}

export interface EmpresaContacto {
    contactoId?: string; // UUID
    empresaId?: string;
    tenantId: string;
    nombreCompleto: string;
    cargo?: string;
    tipoContacto: string; // 'COMERCIAL', 'SEGURIDAD', etc.
    email?: string;
    telefono?: string;
    esPrincipal: boolean;
}

export interface Sede {
    sedeId?: string;     // UUID
    empresaId?: string;
    tenantId: string;
    nombre: string;
    direccion?: string;
    esPrincipal: boolean;
    activo: boolean;
}

export interface Empresa {
    // Identificadores
    empresaId: string;   // UUID (PK)
    tenantId: string;

    // Datos Principales
    ruc: string;
    razonSocial: string;
    
    // Relación con Tipo (FK)
    tipoId?: string;     
    tipo?: TipoContratista; // Objeto completo si el backend lo envía
    tipoNombre?: string;    // Campo auxiliar para grids si el backend aplana el dato

    // Datos de Contacto y Perfil
    direccion?: string;
    telefono?: string;
    email?: string;
    logoUrl?: string;
    sitioWeb?: string;
    rubroComercial?: string;
    
    // Auditoría y Estado
    scoreSeguridad?: number;
    activo: boolean;
    createdAt?: string;

    // Relaciones (Listas)
    contactos?: EmpresaContacto[];
    sedes?: Sede[];
}