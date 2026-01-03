package com.kallpa.ssoma.compliance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateTipoContratistaRequisitoRequest {
    @NotNull(message = "El tipo de contratista es obligatorio")
    private UUID tipoContratistaId;

    @NotBlank(message = "La categoría de requisito es obligatoria")
    private String categoriaRequisito;

    @NotNull(message = "El documento requerible es obligatorio")
    private UUID documentoRequeribleId;

    private Boolean obligatorio;
    private Boolean aplica;
}
