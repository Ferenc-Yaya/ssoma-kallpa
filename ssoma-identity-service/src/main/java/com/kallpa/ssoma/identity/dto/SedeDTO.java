package com.kallpa.ssoma.identity.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SedeDTO {
    private UUID id;
    private UUID empresaId;
    private String tenantId;
    private String nombre;
    private String direccion;
    private Boolean esPrincipal;
    private Boolean activo;
    private LocalDateTime createdAt;
}
