package com.kallpa.ssoma.assets.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateAsignacionRequest {

    @NotNull(message = "El ID del activo es obligatorio")
    private UUID activoId;

    private UUID personaId;

    @NotNull(message = "La fecha de asignación es obligatoria")
    private LocalDate fechaAsignacion;

    private LocalDate fechaDevolucion;

    @Size(max = 20, message = "El estado no puede exceder 20 caracteres")
    private String estado;

    private String observaciones;
}
