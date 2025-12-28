package com.kallpa.ssoma.identity.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class RolDTO {
    private UUID rolId;
    private String codigo;
    private String nombre;
    private String descripcion;
    private Integer nivelJerarquia;
    private Boolean requiereTenant;
    private Long cantidadUsuarios;
    private Boolean activo;
    private LocalDateTime createdAt;
}
