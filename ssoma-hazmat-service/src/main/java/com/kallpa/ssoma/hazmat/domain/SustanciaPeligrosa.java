package com.kallpa.ssoma.hazmat.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cat_sustancias_peligrosas")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SustanciaPeligrosa extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sustancia_id")
    private Long sustanciaId;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "codigo_un")
    private String codigoUn;

    @Column(name = "clase_peligro")
    private String clasePeligro;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "hoja_seguridad_url", length = 500)
    private String hojaSeguridadUrl;
}
