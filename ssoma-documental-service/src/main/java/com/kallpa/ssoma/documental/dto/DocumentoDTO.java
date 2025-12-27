package com.kallpa.ssoma.documental.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DocumentoDTO {

    private Long id;
    private String tenantId;
    private String entidadTipo;
    private Long entidadId;
    private Long documentoRequeribleId;
    private String documentoRequeribleNombre; // Nombre del documento requerible (denormalizado)
    private String nombreArchivo;
    private String rutaArchivo;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private String estado;
    private String observaciones;
    private LocalDateTime createdAt;
}
