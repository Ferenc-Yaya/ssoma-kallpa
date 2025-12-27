package com.kallpa.ssoma.identity.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tbl_contratos")
public class Contrato extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contrato_id")
    private Long contratoId;

    @Column(name = "empresa_id", nullable = false)
    private Long empresaId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empresa_id", insertable = false, updatable = false)
    private Empresa empresa;

    @Column(name = "numero_contrato", nullable = false, unique = true, length = 100)
    private String numeroContrato;

    @Column(name = "numero_oc", length = 100)
    private String numeroOc;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "nivel_riesgo", length = 50)
    private String nivelRiesgo = "MEDIO";

    @Column(name = "admin_contrato_kallpa")
    private String adminContratoKallpa;

    @Column(name = "monto_total", precision = 15, scale = 2)
    private BigDecimal montoTotal;

    @Column(name = "actividades_criticas", columnDefinition = "jsonb")
    private String actividadesCriticas;

    @Column(name = "estado", length = 50)
    private String estado = "VIGENTE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (estado == null) {
            estado = "VIGENTE";
        }
        if (nivelRiesgo == null) {
            nivelRiesgo = "MEDIO";
        }
    }
}
