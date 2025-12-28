package com.kallpa.ssoma.identity.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class EmpresaDTO {
    private UUID id;
    private String tenantId;
    private String ruc;
    private String razonSocial;
    private UUID tipoId;
    private String tipo; // Nombre del tipo de contratista
    private String direccion;
    private String telefono;
    private String email;
    private String estadoHabilitacion;
    private Boolean activo;
    private LocalDateTime createdAt;
    private List<EmpresaContactoDTO> contactos;
}
