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
    private String sustanciaNombre;
    private String codigoUn;
    private String clasePeligro;
    private BigDecimal cantidad;
    private String unidadMedida;
    private String ubicacion;
    private LocalDate fechaIngreso;
    private String lote;
    private String estado;
    private LocalDateTime createdAt;
}
