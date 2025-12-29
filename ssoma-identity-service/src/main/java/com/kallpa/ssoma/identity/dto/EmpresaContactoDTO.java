package com.kallpa.ssoma.identity.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class EmpresaContactoDTO {
    private UUID id;
    private String nombreCompleto;
    private String cargo;
    private String telefono;
    private String email;
    private Boolean esPrincipal;
}
