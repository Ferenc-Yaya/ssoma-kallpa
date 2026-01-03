package com.kallpa.ssoma.compliance.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UpdateEstadoCumplimientoRequest {
    private UUID cumplimientoId;
    private UUID entidadId;
    private String entidadTipo;
    private String tipoEntidad;
    private Boolean esApto;
    private String colorSemaforo;
    private Integer documentosFaltantes;
    private Integer documentosVencidos;
    private Integer documentosVigentes;
    private String detalleJson;
}
