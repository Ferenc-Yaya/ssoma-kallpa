export interface Documento {
  id: number;
  trabajadorId: number;
  trabajadorNombre: string;
  empresaId: number;
  empresaNombre: string;
  tipoDocumento: string;
  nombreArchivo: string;
  urlPdf: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'OBSERVADO' | 'RECHAZADO';
  fechaCarga: string;
  observaciones?: string;
}

export const DOCUMENTOS_MOCK: Documento[] = [
  {
    id: 1,
    trabajadorId: 1,
    trabajadorNombre: 'Juan Pérez García',
    empresaId: 1,
    empresaNombre: 'Contratista KALLPA SAC',
    tipoDocumento: 'DNI',
    nombreArchivo: 'DNI_JuanPerez.pdf',
    urlPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    estado: 'PENDIENTE',
    fechaCarga: '2024-12-01'
  },
  {
    id: 2,
    trabajadorId: 1,
    trabajadorNombre: 'Juan Pérez García',
    empresaId: 1,
    empresaNombre: 'Contratista KALLPA SAC',
    tipoDocumento: 'Certificado Médico',
    nombreArchivo: 'CertMedico_JuanPerez.pdf',
    urlPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    estado: 'PENDIENTE',
    fechaCarga: '2024-12-02'
  },
  {
    id: 3,
    trabajadorId: 2,
    trabajadorNombre: 'María López Silva',
    empresaId: 1,
    empresaNombre: 'Contratista KALLPA SAC',
    tipoDocumento: 'Sctr',
    nombreArchivo: 'SCTR_MariaLopez.pdf',
    urlPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    estado: 'APROBADO',
    fechaCarga: '2024-11-28'
  },
  {
    id: 4,
    trabajadorId: 3,
    trabajadorNombre: 'Carlos Rojas Mendoza',
    empresaId: 3,
    empresaNombre: 'Construcciones Industriales SAA',
    tipoDocumento: 'Curso de Alturas',
    nombreArchivo: 'CursoAlturas_CarlosRojas.pdf',
    urlPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    estado: 'OBSERVADO',
    fechaCarga: '2024-11-30',
    observaciones: 'El certificado está vencido, debe renovar'
  },
  {
    id: 5,
    trabajadorId: 2,
    trabajadorNombre: 'María López Silva',
    empresaId: 1,
    empresaNombre: 'Contratista KALLPA SAC',
    tipoDocumento: 'EPP',
    nombreArchivo: 'EPP_MariaLopez.pdf',
    urlPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    estado: 'RECHAZADO',
    fechaCarga: '2024-11-25',
    observaciones: 'La foto no es legible, debe volver a cargar el documento'
  }
];