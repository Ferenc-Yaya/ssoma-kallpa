package com.kallpa.ssoma.identity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateContratoRequest {

    @NotNull(message = "El ID de la empresa es obligatorio")
    private Long empresaId;

    @NotBlank(message = "El número de contrato es obligatorio")
    @Size(max = 100, message = "El número de contrato no puede exceder 100 caracteres")
    private String numeroContrato;

    @Size(max = 100, message = "El número de OC no puede exceder 100 caracteres")
    private String numeroOc;

    private String descripcion;

    @NotNull(message = "La fecha de inicio es obligatoria")
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
