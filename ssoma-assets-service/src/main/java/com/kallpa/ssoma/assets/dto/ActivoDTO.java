package com.kallpa.ssoma.assets.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ActivoDTO {

    private UUID id;
    private String tenantId;
    private UUID empresaId;
    private String empresaNombre;
    private String tipoActivo;
    private String codigo;
    private String descripcion;
    private String marca;
    private String modelo;
    private String placa;
    private String serie;
    private String categoriaActivo;
    private Integer anioFabricacion;
    private Integer kilometrajeActual;
    private Boolean tieneRops;
    private Boolean tieneFops;
    private LocalDate fechaUltimaCalibracion;
    private Boolean tieneGuardasSeguridad;
    private Boolean sistemaProteccionFugas;
    private String estadoOperativo;
    private String metadata;
    private LocalDateTime createdAt;
}
