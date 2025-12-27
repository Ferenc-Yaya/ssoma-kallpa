package com.kallpa.ssoma.assets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateActivoRequest {

    @NotNull(message = "El ID de la empresa es obligatorio")
    private Long empresaId;

    @NotBlank(message = "El tipo de activo es obligatorio")
    @Size(max = 50, message = "El tipo de activo no puede exceder 50 caracteres")
    private String tipoActivo; // 'VEHICULO', 'HERRAMIENTA'

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 100, message = "El código no puede exceder 100 caracteres")
    private String codigo;

    private String descripcion;

    @Size(max = 100, message = "La marca no puede exceder 100 caracteres")
    private String marca;

    @Size(max = 100, message = "El modelo no puede exceder 100 caracteres")
    private String modelo;

    @Size(max = 20, message = "La placa no puede exceder 20 caracteres")
    private String placa;

    @Size(max = 100, message = "La serie no puede exceder 100 caracteres")
    private String serie;

    @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
    private String estado;

    private String metadata;
}
