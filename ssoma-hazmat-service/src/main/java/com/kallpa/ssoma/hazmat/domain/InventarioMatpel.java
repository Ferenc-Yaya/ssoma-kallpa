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

    @Column(name = "empresa_id", columnDefinition = "UUID")
    private UUID empresaId;

    @Column(name = "sustancia_id", columnDefinition = "UUID")
    private UUID sustanciaId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sustancia_id", insertable = false, updatable = false)
    private SustanciaPeligrosa sustancia;

    @Column(name = "descripcion_uso", columnDefinition = "TEXT")
    private String descripcionUso;

    @Column(name = "ubicacion_almacenamiento", length = 150)
    private String ubicacionAlmacenamiento;

    @Column(name = "cantidad", nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidad;

    @Column(name = "cantidad_estimada", precision = 10, scale = 2)
    private BigDecimal cantidadEstimada;

    @Column(name = "unidad_medida", length = 20)
    private String unidadMedida;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;

    @Column(name = "lote", length = 100)
    private String lote;

    @Column(name = "estado", length = 50)
    private String estado = "ALMACENADO";

    @Column(name = "estado_autorizacion", length = 20)
    private String estadoAutorizacion = "PENDIENTE";
}
