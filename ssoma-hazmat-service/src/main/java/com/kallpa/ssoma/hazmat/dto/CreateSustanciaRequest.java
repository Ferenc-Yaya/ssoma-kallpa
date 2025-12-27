package com.kallpa.ssoma.hazmat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSustanciaRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String codigoUn;

    private String clasePeligro;

    private String descripcion;

    private String hojaSeguridadUrl;
}
