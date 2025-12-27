package com.kallpa.ssoma.hazmat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateInventarioRequest {
    private BigDecimal cantidad;
    private String unidadMedida;
    private String ubicacion;
    private LocalDate fechaIngreso;
    private String lote;
    private String estado;
}
