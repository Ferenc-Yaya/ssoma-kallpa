package com.kallpa.ssoma.documental.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DocumentoRequeribleDTO {

    private java.util.UUID id;
    private String tenantId;
    private String codigoInterno;
    private String nombreMostrar;
    private String nombre;
    private String categoria;
    private String categoriaAgrupacion;
    private String descripcion;
    private LocalDateTime createdAt;
}
