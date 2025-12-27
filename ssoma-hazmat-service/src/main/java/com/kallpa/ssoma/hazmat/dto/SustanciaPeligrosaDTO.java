package com.kallpa.ssoma.hazmat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SustanciaPeligrosaDTO {
    private Long sustanciaId;
    private String tenantId;
    private String nombre;
    private String codigoUn;
    private String clasePeligro;
    private String descripcion;
    private String hojaSeguridadUrl;
    private LocalDateTime createdAt;
}
