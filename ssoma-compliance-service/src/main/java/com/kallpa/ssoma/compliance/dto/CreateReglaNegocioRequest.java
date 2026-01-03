package com.kallpa.ssoma.compliance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateReglaNegocioRequest {
    private UUID aplicarATipoEmpresa;
    private String aplicarARolOTipo;

    @NotBlank(message = "La entidad objetivo es obligatoria")
    private String entidadObjetivo;

    private UUID docReqId;

    @NotBlank(message = "El nombre de la regla es obligatorio")
    private String nombreRegla;

    private String categoria;

    @NotBlank(message = "La condición es obligatoria")
    private String condicion;

    private Integer diasVigenciaMinima;
    private Boolean esBloqueante;

    @NotBlank(message = "El color semáforo es obligatorio")
    private String colorSemaforo;

    private String mensajeAlerta;
    private Boolean activa;
    private Boolean activo;
}
