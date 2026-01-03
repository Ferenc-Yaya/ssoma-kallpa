package com.kallpa.ssoma.assets.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UpdateAsignacionRequest {

    private UUID personaId;

    private LocalDate fechaAsignacion;

    private LocalDate fechaDevolucion;

    private LocalDateTime fechaFin;

    @Size(max = 20, message = "El estado no puede exceder 20 caracteres")
    private String estado;

    private String observaciones;
}
