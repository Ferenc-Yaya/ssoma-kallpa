package com.kallpa.ssoma.hazmat.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "cat_sustancias_peligrosas")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SustanciaPeligrosa extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "sustancia_id", columnDefinition = "UUID")
    private UUID sustanciaId;

    @Column(name = "nombre_producto", nullable = false, length = 200)
    private String nombreProducto;

    @Column(name = "marca_fabricante", nullable = false, length = 100)
    private String marcaFabricante;

    @Column(name = "estado_fisico", length = 20)
    private String estadoFisico;

    @Column(name = "nfpa_salud")
    private Integer nfpaSalud = 0;

    @Column(name = "nfpa_inflamabilidad")
    private Integer nfpaInflamabilidad = 0;

    @Column(name = "nfpa_reactividad")
    private Integer nfpaReactividad = 0;

    @Column(name = "nfpa_riesgo_especifico", length = 10)
    private String nfpaRiesgoEspecifico;

    @Column(name = "numero_un", length = 50)
    private String numeroUn;

    @Column(name = "codigo_un", length = 20)
    private String codigoUn;

    @Column(name = "clase_peligro", length = 50)
    private String clasePeligro;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "hoja_seguridad_url", length = 500)
    private String hojaSeguridadUrl;
}
