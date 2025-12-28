package com.kallpa.ssoma.documental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateDocumentoRequest {

    @NotBlank(message = "El tipo de entidad es obligatorio")
    @Size(max = 50, message = "El tipo de entidad no puede exceder 50 caracteres")
    private String entidadTipo; // 'EMPRESA', 'PERSONA', 'ACTIVO', 'CONTRATO'

    @NotNull(message = "El ID de la entidad es obligatorio")
    private UUID entidadId;

    private UUID documentoRequeribleId;

    @NotBlank(message = "El nombre del archivo es obligatorio")
    @Size(max = 255, message = "El nombre del archivo no puede exceder 255 caracteres")
    private String nombreArchivo;

    @NotBlank(message = "La ruta del archivo es obligatoria")
    @Size(max = 500, message = "La ruta del archivo no puede exceder 500 caracteres")
    private String rutaArchivo;

    private LocalDate fechaEmision;

    private LocalDate fechaVencimiento;

    @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
    private String estado;

    private String observaciones;
}
