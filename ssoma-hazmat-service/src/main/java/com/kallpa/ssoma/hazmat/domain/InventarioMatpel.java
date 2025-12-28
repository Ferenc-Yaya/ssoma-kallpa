package com.kallpa.ssoma.hazmat.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "tbl_inventario_matpel")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventarioMatpel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "inventario_id", columnDefinition = "UUID")
    private UUID inventarioId;

    @Column(name = "empresa_id", nullable = false, columnDefinition = "UUID")
    private UUID empresaId;

    @Column(name = "sustancia_id", nullable = false, columnDefinition = "UUID")
    private UUID sustanciaId;

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
