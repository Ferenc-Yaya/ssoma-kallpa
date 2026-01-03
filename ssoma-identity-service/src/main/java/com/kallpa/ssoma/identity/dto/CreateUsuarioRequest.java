package com.kallpa.ssoma.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateUsuarioRequest {

    private UUID personaId;

    @NotBlank(message = "El username es requerido")
    @Size(min = 4, max = 100, message = "El username debe tener entre 4 y 100 caracteres")
    private String username;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

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

    private Boolean activo = true;
}
