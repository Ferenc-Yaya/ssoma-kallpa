package com.kallpa.ssoma.documental.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DocumentoRequeribleDTO {

    private Long id;
    private String tenantId;
    private String nombre;
    private String categoria;
    private String descripcion;
    private Boolean obligatorio;
    private LocalDateTime createdAt;
}
