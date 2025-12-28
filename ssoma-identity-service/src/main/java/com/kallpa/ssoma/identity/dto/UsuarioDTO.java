package com.kallpa.ssoma.identity.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UsuarioDTO {
    private UUID usuarioId;
    private String username;
    private String nombreCompleto;
    private String email;
    private UUID rolId;
    private String rolNombre;
    private String rolCodigo;
    private String tenantId;
    private String empresaNombre;
    private Boolean activo;
    private LocalDateTime ultimoAcceso;
    private LocalDateTime createdAt;
}