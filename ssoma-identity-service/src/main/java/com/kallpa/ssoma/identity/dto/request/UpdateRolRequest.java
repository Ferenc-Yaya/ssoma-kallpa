package com.kallpa.ssoma.identity.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateRolRequest {

    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombreRol;

    private String descripcion;

    private Integer nivelJerarquia;

    private Boolean requiereTenant;

    private Object permisos;

    private Boolean activo;
}
