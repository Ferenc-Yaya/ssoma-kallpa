export interface Notificacion {
  id: number;
  tipo: 'DOCUMENTO_VENCIDO' | 'TRABAJADOR_PENDIENTE' | 'CONTRATO_POR_VENCER' | 'ALERTA';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  url?: string;
  icon: string;
  color: string;
}

export const NOTIFICACIONES_MOCK: Notificacion[] = [
  {
    id: 1,
    tipo: 'DOCUMENTO_VENCIDO',
    titulo: '5 Documentos Vencidos',
    mensaje: 'Hay 5 documentos de trabajadores que han vencido y requieren actualización',
    fecha: '2025-05-10T10:30:00',
    leida: false,
    url: '/acreditacion',
    icon: 'description',
    color: '#ef4444'
  },
  {
    id: 2,
    tipo: 'TRABAJADOR_PENDIENTE',
    titulo: '2 Trabajadores Pendientes de Acreditación',
    mensaje: 'Hay 2 trabajadores esperando revisión de documentos',
    fecha: '2025-05-10T09:15:00',
    leida: false,
    url: '/acreditacion',
    icon: 'person_alert',
    color: '#f59e0b'
  },
  {
    id: 3,
    tipo: 'CONTRATO_POR_VENCER',
    titulo: '1 Contrato por Vencer',
    mensaje: 'El contrato con Contratista KALLPA SAC vence en 15 días',
    fecha: '2025-05-09T14:20:00',
    leida: false,
    url: '/empresas',
    icon: 'event_busy',
    color: '#eab308'
  },
  {
    id: 4,
    tipo: 'ALERTA',
    titulo: 'Certificado Médico por Vencer',
    mensaje: '3 trabajadores tienen certificados médicos que vencen este mes',
    fecha: '2025-05-08T11:00:00',
    leida: true,
    url: '/acreditacion',
    icon: 'medical_services',
    color: '#3b82f6'
  }
];