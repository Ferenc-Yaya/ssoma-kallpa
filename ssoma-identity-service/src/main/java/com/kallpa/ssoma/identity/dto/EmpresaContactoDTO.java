package com.kallpa.ssoma.identity.dto;

import lombok.Data;

@Data
public class EmpresaContactoDTO {
    private Long id;
    private String nombreCompleto;
    private String cargo;
    private String telefono;
    private String email;
    private Boolean esPrincipal;
}
