package com.kallpa.ssoma.hazmat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventarioMatpelDTO {
    private UUID inventarioId;
    private String tenantId;
    private UUID empresaId;
    private UUID sustanciaId;
    private String sustanciaNombreProducto;
    private String codigoUn;
    private String clasePeligro;
    private String descripcionUso;
    private String ubicacionAlmacenamiento;
    private BigDecimal cantidad;
    private BigDecimal cantidadEstimada;
    private String unidadMedida;
    private LocalDate fechaIngreso;
    private String lote;
    private String estado;
    private String estadoAutorizacion;
    private LocalDateTime createdAt;
}
