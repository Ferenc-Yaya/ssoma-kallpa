// src/app/core/models/documento.model.ts

export interface DocumentoRequerible {
    docReqId: string;
    codigoInterno: string;
    nombreMostrar: string;
    categoria?: string;
}

export interface Documento {
    documentoId: string;
    tenantId: string;
    
    // Polimorfismo (A quién pertenece el documento)
    entidadId: string;      // ID de Empresa, Persona o Activo
    entidadTipo: string;    // 'EMPRESA', 'PERSONA', 'ACTIVO'
    
    docReqId?: string;
    nombreArchivo: string;
    rutaArchivo: string;
    archivoUrl: string;
    
    fechaEmision?: string;
    fechaVencimiento?: string;
    
    estado: string;           // 'VIGENTE', 'VENCIDO'
    estadoValidacion: string; // 'PENDIENTE', 'APROBADO', 'RECHAZADO'
    observaciones?: string;
}

export interface EstadoCumplimiento {
    estadoId: string;
    entidadId: string;
    entidadTipo: string; // 'EMPRESA', 'PERSONA', 'ACTIVO'
    
    esApto: boolean;
    colorSemaforo: string; // 'ROJO', 'AMBAR', 'VERDE'
    
    documentosFaltantes: number;
    documentosVencidos: number;
    documentosVigentes: number;
    
    ultimaActualizacion: string;
}