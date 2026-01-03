package com.kallpa.ssoma.documental.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateDocumentoRequest {

    @Size(max = 255, message = "El nombre del archivo no puede exceder 255 caracteres")
    private String nombreArchivo;

    @Size(max = 100, message = "El número de documento no puede exceder 100 caracteres")
    private String numeroDocumento;

    @Size(max = 500, message = "La ruta del archivo no puede exceder 500 caracteres")
    private String rutaArchivo;

    private String archivoUrl;

    private LocalDate fechaEmision;

    private LocalDate fechaVencimiento;

    @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
    private String estado;

    @Size(max = 20, message = "El estado de validación no puede exceder 20 caracteres")
    private String estadoValidacion;

    private String observaciones;
}
