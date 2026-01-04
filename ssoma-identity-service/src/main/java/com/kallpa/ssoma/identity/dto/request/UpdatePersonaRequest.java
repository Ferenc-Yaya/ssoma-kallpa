package com.kallpa.ssoma.identity.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class UpdatePersonaRequest {

    private UUID empresaId;

    private UUID contratoActivoId;

    @Size(max = 20, message = "El tipo de documento no puede exceder 20 caracteres")
    private String tipoDocumento;

    @Size(max = 100, message = "Los nombres no pueden exceder 100 caracteres")
    private String nombres;

    @Size(max = 100, message = "Los apellidos no pueden exceder 100 caracteres")
    private String apellidos;

    private LocalDate fechaNacimiento;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;

    @Email(message = "El email debe ser válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;

    @Size(max = 100, message = "El cargo no puede exceder 100 caracteres")
    private String cargo;

    private Boolean esConductor;

    @Size(max = 10, message = "El grupo sanguíneo no puede exceder 10 caracteres")
    private String grupoSanguineo;

    private String fotoPerfilUrl;

    @Size(max = 20, message = "El estado no puede exceder 20 caracteres")
    private String estadoGlobal;
}
