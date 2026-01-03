package com.kallpa.ssoma.compliance.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReglaNegocioDTO {
    private UUID reglaId;
    private String tenantId;
    private UUID aplicarATipoEmpresa;
    private String aplicarARolOTipo;
    private String entidadObjetivo;
    private UUID docReqId;
    private String nombreRegla;
    private String categoria;
    private String condicion;
    private Integer diasVigenciaMinima;
    private Boolean esBloqueante;
    private String colorSemaforo;
    private String mensajeAlerta;
    private Boolean activa;
    private Boolean activo;
    private LocalDateTime createdAt;
}
