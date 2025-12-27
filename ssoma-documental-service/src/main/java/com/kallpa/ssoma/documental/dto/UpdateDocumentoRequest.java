package com.kallpa.ssoma.documental.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateDocumentoRequest {

    @Size(max = 255, message = "El nombre del archivo no puede exceder 255 caracteres")
    private String nombreArchivo;

    @Size(max = 500, message = "La ruta del archivo no puede exceder 500 caracteres")
    private String rutaArchivo;

    private LocalDate fechaEmision;

    private LocalDate fechaVencimiento;

    @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
    private String estado;

    private String observaciones;
}
