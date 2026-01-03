package com.kallpa.ssoma.hazmat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSustanciaRequest {
    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombreProducto;

    @NotBlank(message = "La marca/fabricante es obligatoria")
    private String marcaFabricante;

    private String estadoFisico;

    private Integer nfpaSalud;

    private Integer nfpaInflamabilidad;

    private Integer nfpaReactividad;

    private String nfpaRiesgoEspecifico;

    private String numeroUn;

    private String codigoUn;

    private String clasePeligro;

    private String descripcion;

    private String hojaSeguridadUrl;
}
