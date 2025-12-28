package com.kallpa.ssoma.documental.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class DocumentoDTO {

    private UUID id;
    private String tenantId;
    private String entidadTipo;
    private UUID entidadId;
    private UUID documentoRequeribleId;
    private String documentoRequeribleNombre; // Nombre del documento requerible (denormalizado)
    private String nombreArchivo;
    private String rutaArchivo;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private String estado;
    private String observaciones;
    private LocalDateTime createdAt;
}
