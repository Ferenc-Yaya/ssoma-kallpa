package com.kallpa.ssoma.identity.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PersonaDTO {

    private Long id;
    private String tenantId;
    private Long empresaId;
    private String empresaNombre; // Razón social de la empresa (denormalizado)
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombres;
    private String apellidos;
    private String nombreCompleto; // Nombres + Apellidos (denormalizado)
    private LocalDate fechaNacimiento;
    private String telefono;
    private String email;
    private String cargo;
    private String estado;
    private LocalDateTime createdAt;
}
