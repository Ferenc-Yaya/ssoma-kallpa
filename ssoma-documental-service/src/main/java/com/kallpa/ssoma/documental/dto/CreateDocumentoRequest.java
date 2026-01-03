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

    private UUID docReqId;

    @NotBlank(message = "El nombre del archivo es obligatorio")
    @Size(max = 255, message = "El nombre del archivo no puede exceder 255 caracteres")
    private String nombreArchivo;

    @Size(max = 100, message = "El número de documento no puede exceder 100 caracteres")
    private String numeroDocumento;

    @NotBlank(message = "La ruta del archivo es obligatoria")
    @Size(max = 500, message = "La ruta del archivo no puede exceder 500 caracteres")
    private String rutaArchivo;

    @NotBlank(message = "La URL del archivo es obligatoria")
    private String archivoUrl;

    private LocalDate fechaEmision;

    private LocalDate fechaVencimiento;

    @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
    private String estado;

    @Size(max = 20, message = "El estado de validación no puede exceder 20 caracteres")
    private String estadoValidacion;

    private String observaciones;
}
