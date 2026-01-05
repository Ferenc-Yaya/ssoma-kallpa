package com.kallpa.ssoma.identity.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class TipoContratistaDTO {
    private UUID tipoId;
    private String codigo;
    private String nombre;
    private String descripcion;
}
