// src/app/core/models/activo.model.ts

export interface Activo {
    activoId: string;
    tenantId: string;
    empresaId: string;
    
    // Identificación
    tipoActivo: string; // 'VEHICULO_LIVIANO', 'MAQUINARIA_PESADA'
    codigo: string;     // Código interno
    marca?: string;
    modelo?: string;
    placa?: string;
    serie?: string;
    
    // Estado Técnico
    anioFabricacion?: number;
    kilometrajeActual?: number;
    fechaUltimaCalibracion?: string;
    estadoOperativo: string; // 'OPERATIVO', 'MANTENIMIENTO'
    
    // Flags de Seguridad
    tieneRops: boolean;
    tieneFops: boolean;
    tieneGuardasSeguridad: boolean;
    
    // JSONB
    metadata?: any;
}

export interface Asignacion {
    asignacionId: string;
    activoId: string;
    personaId?: string;
    fechaAsignacion: string;
    fechaDevolucion?: string;
    estado: string; // 'VIGENTE', 'DEVUELTO'
}