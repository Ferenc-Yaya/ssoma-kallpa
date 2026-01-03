package com.kallpa.ssoma.compliance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateEstadoCumplimientoRequest {
    private UUID cumplimientoId;

    @NotNull(message = "El ID de entidad es obligatorio")
    private UUID entidadId;

    @NotBlank(message = "El tipo de entidad es obligatorio")
    private String entidadTipo;

    @NotBlank(message = "El tipo de entidad es obligatorio")
    private String tipoEntidad;

    private Boolean esApto;

    @NotBlank(message = "El color semáforo es obligatorio")
    private String colorSemaforo;

    private Integer documentosFaltantes;
    private Integer documentosVencidos;
    private Integer documentosVigentes;
    private String detalleJson;
}
