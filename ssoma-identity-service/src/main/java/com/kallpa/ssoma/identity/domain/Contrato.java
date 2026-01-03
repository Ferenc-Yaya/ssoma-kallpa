package com.kallpa.ssoma.identity.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(
        name = "tbl_contratos",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tenant_id", "numero_oc"})
)
public class Contrato extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "contrato_id")
    private UUID contratoId;

    @Column(name = "tenant_id", nullable = false, length = 50)
    private String tenantId;

    @Column(name = "empresa_id")
    private UUID empresaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", insertable = false, updatable = false)
    private Empresa empresa;

    @Column(name = "numero_contrato", length = 100)
    private String numeroContrato;

    @Column(name = "numero_oc", nullable = false, length = 50)
    private String numeroOc;

    @Column(name = "descripcion_servicio", columnDefinition = "TEXT")
    private String descripcionServicio;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "nivel_riesgo", length = 50)
    private String nivelRiesgo;

    @Column(name = "admin_contrato_kallpa", length = 150)
    private String adminContratoKallpa;

    @Column(name = "monto_total", precision = 15, scale = 2)
    private BigDecimal montoTotal;

    @Type(JsonBinaryType.class)
    @Column(name = "actividades_criticas", columnDefinition = "jsonb")
    private Object actividadesCriticas;

    @Column(name = "estado", length = 20)
    private String estado;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (estado == null) estado = "ACTIVO";
        if (nivelRiesgo == null) nivelRiesgo = "MEDIO";
    }
}
