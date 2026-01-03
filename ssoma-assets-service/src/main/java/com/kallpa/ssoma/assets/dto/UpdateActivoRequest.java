package com.kallpa.ssoma.assets.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class UpdateActivoRequest {

    private UUID empresaId;

    @Size(max = 50, message = "El tipo de activo no puede exceder 50 caracteres")
    private String tipoActivo;

    private String descripcion;

    @Size(max = 100, message = "La marca no puede exceder 100 caracteres")
    private String marca;

    @Size(max = 100, message = "El modelo no puede exceder 100 caracteres")
    private String modelo;

    @Size(max = 20, message = "La placa no puede exceder 20 caracteres")
    private String placa;

    @Size(max = 100, message = "La serie no puede exceder 100 caracteres")
    private String serie;

    @Size(max = 50, message = "La categoría de activo no puede exceder 50 caracteres")
    private String categoriaActivo;

    private Integer anioFabricacion;

    private Integer kilometrajeActual;

    private Boolean tieneRops;

    private Boolean tieneFops;

    private LocalDate fechaUltimaCalibracion;

    private Boolean tieneGuardasSeguridad;

    private Boolean sistemaProteccionFugas;

    @Size(max = 20, message = "El estado operativo no puede exceder 20 caracteres")
    private String estadoOperativo;

    private String metadata;
}
