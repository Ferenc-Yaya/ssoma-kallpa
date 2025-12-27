package com.kallpa.ssoma.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateEmpresaRequest {

    @Size(max = 255, message = "La razón social no puede exceder 255 caracteres")
    private String razonSocial;

    private Integer tipoContratistaId;

    private String direccion;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;

    @Email(message = "El email debe ser válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;

    private String estado;

    private List<EmpresaContactoDTO> contactos;
}
