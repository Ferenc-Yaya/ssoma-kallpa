package com.kallpa.ssoma.compliance.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "tbl_reglas_negocio")
@EqualsAndHashCode(callSuper = true)
public class ReglaNegocio extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "regla_id")
    private Long reglaId;

    @Column(name = "nombre_regla", nullable = false)
    private String nombreRegla;

    @Column(name = "categoria")
    private String categoria; // 'EMPRESA', 'TRABAJADOR', 'VEHICULO', 'HERRAMIENTA'

    @Column(name = "condicion", nullable = false)
    private String condicion;

    @Column(name = "color_semaforo", nullable = false)
    private String colorSemaforo; // 'VERDE', 'AMARILLO', 'ROJO'

    @Column(name = "mensaje_alerta")
    private String mensajeAlerta;

    @Column(name = "activa")
    private Boolean activa = true;
}