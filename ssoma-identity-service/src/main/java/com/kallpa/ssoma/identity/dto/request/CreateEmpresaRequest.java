package com.kallpa.ssoma.identity.dto.request;

import com.kallpa.ssoma.identity.dto.EmpresaContactoDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CreateEmpresaRequest {

    // Solo SUPER_ADMIN puede especificar este campo para asignar a otra empresa principal
    private String tenantId;

    @NotBlank(message = "El RUC es obligatorio")
    @Size(min = 11, max = 11, message = "El RUC debe tener 11 dígitos")
    private String ruc;

    @NotBlank(message = "La razón social es obligatoria")
    @Size(max = 255, message = "La razón social no puede exceder 255 caracteres")
    private String razonSocial;

    private UUID tipoId;

    private String direccion;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;

    @Email(message = "El email debe ser válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;

    private String logoUrl;

    @Size(max = 100, message = "El sitio web no puede exceder 100 caracteres")
    private String sitioWeb;

    @Size(max = 100, message = "El rubro comercial no puede exceder 100 caracteres")
    private String rubroComercial;

    private Integer scoreSeguridad;

    private Boolean activo;

    private List<EmpresaContactoDTO> contactos;
}
