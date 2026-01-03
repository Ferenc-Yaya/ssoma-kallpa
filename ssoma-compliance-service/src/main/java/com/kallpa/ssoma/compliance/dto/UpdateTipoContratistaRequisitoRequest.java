package com.kallpa.ssoma.compliance.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UpdateTipoContratistaRequisitoRequest {
    private UUID tipoContratistaId;
    private String categoriaRequisito;
    private UUID documentoRequeribleId;
    private Boolean obligatorio;
    private Boolean aplica;
}
