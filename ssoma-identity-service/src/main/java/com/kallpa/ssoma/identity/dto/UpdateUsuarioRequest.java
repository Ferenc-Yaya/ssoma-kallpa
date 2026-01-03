package com.kallpa.ssoma.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class UpdateUsuarioRequest {

    private UUID personaId;

    @NotBlank(message = "El nombre completo es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombreCompleto;

    @NotBlank(message = "El email es requerido")
    @Email(message = "Email inválido")
    private String email;

    @NotNull(message = "El rol es requerido")
    private UUID rolId;

    private String tenantId;

    private String empresaNombre;

    @NotNull(message = "El estado es requerido")
    private Boolean activo;
}
