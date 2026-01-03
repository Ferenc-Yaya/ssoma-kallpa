package com.kallpa.ssoma.assets.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AsignacionDTO {

    private UUID id;
    private String tenantId;
    private UUID activoId;
    private String activoCodigo;
    private String activoDescripcion;
    private UUID personaId;
    private String personaNombre;
    private LocalDate fechaAsignacion;
    private LocalDate fechaDevolucion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private String estado;
    private String observaciones;
    private LocalDateTime createdAt;
}
