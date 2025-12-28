package com.kallpa.ssoma.assets.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ActivoDTO {

    private UUID id;
    private String tenantId;
    private UUID empresaId;
    private String empresaNombre; // Razón social de la empresa (denormalizado)
    private String tipoActivo;
    private String codigo;
    private String descripcion;
    private String marca;
    private String modelo;
    private String placa;
    private String serie;
    private String estado;
    private String metadata;
    private LocalDateTime createdAt;
}
