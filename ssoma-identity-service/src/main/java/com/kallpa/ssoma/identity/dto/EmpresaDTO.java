package com.kallpa.ssoma.identity.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EmpresaDTO {
    private Long id;
    private String tenantId;
    private String ruc;
    private String razonSocial;
    private Integer tipoContratistaId;
    private String tipo; // Nombre del tipo de contratista
    private String direccion;
    private String telefono;
    private String email;
    private String estado;
    private LocalDateTime createdAt;
    private List<EmpresaContactoDTO> contactos;
}
