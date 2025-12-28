package com.kallpa.ssoma.identity.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ContratoDTO {

    private UUID id;
    private String tenantId;
    private UUID empresaId;
    private String empresaNombre; // Razón social de la empresa (denormalizado)
    private String numeroContrato;
    private String numeroOc;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String nivelRiesgo;
    private String adminContratoKallpa;
    private BigDecimal montoTotal;
    private String actividadesCriticas;
    private String estado;
    private LocalDateTime createdAt;
}
