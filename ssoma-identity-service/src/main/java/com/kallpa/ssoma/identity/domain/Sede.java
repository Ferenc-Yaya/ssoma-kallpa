package com.kallpa.ssoma.identity.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tbl_sedes")
public class Sede extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "sede_id")
    private UUID sedeId;

    @Column(name = "tenant_id", nullable = false, length = 50)
    private String tenantId;

    @Column(name = "empresa_id", nullable = false, columnDefinition = "UUID")
    private UUID empresaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", insertable = false, updatable = false)
    private Empresa empresa;

    @Column(name = "nombre", nullable = false, length = 255)
    private String nombre;

    @Column(name = "direccion", columnDefinition = "TEXT")
    private String direccion;

    @Column(name = "es_principal")
    private Boolean esPrincipal = false;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
