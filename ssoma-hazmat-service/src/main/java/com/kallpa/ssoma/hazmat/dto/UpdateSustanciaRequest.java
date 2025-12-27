package com.kallpa.ssoma.hazmat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSustanciaRequest {
    private String nombre;
    private String codigoUn;
    private String clasePeligro;
    private String descripcion;
    private String hojaSeguridadUrl;
}
