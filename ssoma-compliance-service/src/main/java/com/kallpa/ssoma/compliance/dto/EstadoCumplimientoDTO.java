package com.kallpa.ssoma.compliance.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class EstadoCumplimientoDTO {
    private UUID estadoId;
    private UUID cumplimientoId;
    private String tenantId;
    private UUID entidadId;
    private String entidadTipo;
    private String tipoEntidad;
    private Boolean esApto;
    private String colorSemaforo;
    private Integer documentosFaltantes;
    private Integer documentosVencidos;
    private Integer documentosVigentes;
    private String detalleJson;
    private LocalDateTime ultimaActualizacion;
    private LocalDateTime createdAt;
}
