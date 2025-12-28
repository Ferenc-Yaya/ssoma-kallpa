package com.kallpa.ssoma.hazmat.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInventarioRequest {
    @NotNull(message = "El ID de empresa es obligatorio")
    private UUID empresaId;

    @NotNull(message = "El ID de sustancia es obligatorio")
    private UUID sustanciaId;

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a cero")
    private BigDecimal cantidad;

    private String unidadMedida;

    private String ubicacion;

    @NotNull(message = "La fecha de ingreso es obligatoria")
    private LocalDate fechaIngreso;

    private String lote;

    private String estado;
}
