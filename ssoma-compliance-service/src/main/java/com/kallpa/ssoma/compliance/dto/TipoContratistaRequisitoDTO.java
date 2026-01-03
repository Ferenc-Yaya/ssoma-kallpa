package com.kallpa.ssoma.compliance.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TipoContratistaRequisitoDTO {
    private UUID requisitoId;
    private String tenantId;
    private UUID tipoContratistaId;
    private String categoriaRequisito;
    private UUID documentoRequeribleId;
    private Boolean obligatorio;
    private Boolean aplica;
    private LocalDateTime createdAt;
}
