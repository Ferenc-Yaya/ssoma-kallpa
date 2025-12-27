package com.kallpa.ssoma.assets.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivoDTO {

    private Long id;
    private String tenantId;
    private Long empresaId;
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
