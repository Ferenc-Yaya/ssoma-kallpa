package com.kallpa.ssoma.assets.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateActivoRequest {

    private Long empresaId;

    @Size(max = 50, message = "El tipo de activo no puede exceder 50 caracteres")
    private String tipoActivo;

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
