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
    private UUID docReqId;
    private String documentoRequeribleNombre;
    private String nombreArchivo;
    private String numeroDocumento;
    private String rutaArchivo;
    private String archivoUrl;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private String estado;
    private String estadoValidacion;
    private String observaciones;
    private LocalDateTime createdAt;
}
