// src/app/core/models/usuario.model.ts

export interface Rol {
    rolId: string;
    codigo: string;
    nombreRol: string;
    descripcion?: string;
    permisos?: any; // JSONB en base de datos
    activo: boolean;
}

export interface Persona {
    personaId: string;
    tenantId: string;
    empresaId?: string;
    contratoActivoId?: string;
    
    tipoDocumento: string; // 'DNI', 'CE', etc.
    numeroDocumento: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento?: string; // Date string 'YYYY-MM-DD'
    telefono?: string;
    email?: string;
    cargo: string;
    
    esConductor: boolean;
    grupoSanguineo?: string;
    fotoPerfilUrl?: string;
    estadoGlobal: string; // 'ACTIVO', 'CESADO'
}

export interface Usuario {
    usuarioId: string;
    tenantId: string;
    username: string;
    email: string;
    nombreCompleto?: string;
    
    // Relaciones
    personaId?: string;
    persona?: Persona;
    rolId?: string;
    rol?: Rol;

    activo: boolean;
    ultimoAcceso?: string;
}