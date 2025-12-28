package com.kallpa.ssoma.identity.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class UpdateContratoRequest {

    private UUID empresaId;

    @Size(max = 100, message = "El número de OC no puede exceder 100 caracteres")
    private String numeroOc;

    private String descripcion;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    @Size(max = 50, message = "El nivel de riesgo no puede exceder 50 caracteres")
    private String nivelRiesgo;

    @Size(max = 255, message = "El administrador de contrato no puede exceder 255 caracteres")
    private String adminContratoKallpa;

    private BigDecimal montoTotal;

    private String actividadesCriticas;

    @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
    private String estado;
}
