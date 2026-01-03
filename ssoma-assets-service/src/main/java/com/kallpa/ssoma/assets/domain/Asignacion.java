package com.kallpa.ssoma.assets.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tbl_asignaciones")
public class Asignacion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "asignacion_id", columnDefinition = "UUID")
    private UUID asignacionId;

    @Column(name = "activo_id", nullable = false, columnDefinition = "UUID")
    private UUID activoId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "activo_id", insertable = false, updatable = false)
    private Activo activo;

    @Column(name = "persona_id", columnDefinition = "UUID")
    private UUID personaId;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDate fechaAsignacion;

    @Column(name = "fecha_devolucion")
    private LocalDate fechaDevolucion;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "estado", length = 20)
    private String estado = "VIGENTE";

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (fechaInicio == null) {
            fechaInicio = LocalDateTime.now();
        }
        if (estado == null) {
            estado = "VIGENTE";
        }
    }
}
