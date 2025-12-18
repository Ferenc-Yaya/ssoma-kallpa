package com.kallpa.ssoma.identity.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Long usuarioId;
    private String username;
    private String email;
    private String rolNombre;
    private Boolean activo;
}