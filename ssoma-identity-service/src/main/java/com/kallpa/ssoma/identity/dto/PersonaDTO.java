package com.kallpa.ssoma.identity.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PersonaDTO {

    private UUID id;
    private String tenantId;
    private UUID empresaId;
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
