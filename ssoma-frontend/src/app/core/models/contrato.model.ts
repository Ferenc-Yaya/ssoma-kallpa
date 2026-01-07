// src/app/core/models/contrato.model.ts

export interface Contrato {
    contratoId: string;
    tenantId: string;
    empresaId?: string;
    
    // Datos del Contrato
    numeroContrato?: string;
    numeroOc: string;       // Orden de Compra
    descripcionServicio?: string;
    
    // Fechas
    fechaInicio?: string;
    fechaFin?: string;
    
    // Gestión
    nivelRiesgo?: string;
    adminContratoKallpa?: string;
    montoTotal?: number;
    
    // JSONB
    actividadesCriticas?: string[] | any; 
    
    estado: string; // 'ACTIVO', 'VENCIDO', 'FINALIZADO'
}