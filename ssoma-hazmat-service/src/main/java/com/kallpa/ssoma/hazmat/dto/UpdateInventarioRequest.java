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
    private String descripcionUso;
    private String ubicacionAlmacenamiento;
    private BigDecimal cantidad;
    private BigDecimal cantidadEstimada;
    private String unidadMedida;
    private LocalDate fechaIngreso;
    private String lote;
    private String estado;
    private String estadoAutorizacion;
}
