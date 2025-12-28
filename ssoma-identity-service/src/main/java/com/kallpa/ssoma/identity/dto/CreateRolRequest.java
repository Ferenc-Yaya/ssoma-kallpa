package com.kallpa.ssoma.identity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateRolRequest {

    @NotBlank(message = "El código es requerido")
    @Size(max = 50, message = "El código no puede exceder 50 caracteres")
    private String codigo;

    @NotBlank(message = "El nombre es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "La descripción es requerida")
    @Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
    private String descripcion;

    @NotNull(message = "El nivel de jerarquía es requerido")
    private Integer nivelJerarquia;

    @NotNull(message = "El campo requiereTenant es requerido")
    private Boolean requiereTenant;

    private Boolean activo = true;
}
