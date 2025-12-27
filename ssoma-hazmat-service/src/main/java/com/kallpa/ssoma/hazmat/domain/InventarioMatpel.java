package com.kallpa.ssoma.hazmat.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tbl_inventario_matpel")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventarioMatpel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventario_id")
    private Long inventarioId;

    @Column(name = "empresa_id", nullable = false)
    private Long empresaId;

    @Column(name = "sustancia_id", nullable = false)
    private Long sustanciaId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sustancia_id", insertable = false, updatable = false)
    private SustanciaPeligrosa sustancia;

    @Column(name = "cantidad", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidad;

    @Column(name = "unidad_medida")
    private String unidadMedida;

    @Column(name = "ubicacion")
    private String ubicacion;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;

    @Column(name = "lote")
    private String lote;

    @Column(name = "estado")
    private String estado; // ALMACENADO, EN_USO, AGOTADO
}
