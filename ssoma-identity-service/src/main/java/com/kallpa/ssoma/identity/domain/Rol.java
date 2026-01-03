package com.kallpa.ssoma.identity.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(
        name = "tbl_roles",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"tenant_id", "nombre_rol"}),
                @UniqueConstraint(columnNames = {"codigo"})
        }
)
public class Rol extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "rol_id")
    private UUID rolId;

    @Column(name = "tenant_id", nullable = false, length = 50)
    private String tenantId;

    @Column(name = "codigo", nullable = false, length = 50)
    private String codigo;

    @Column(name = "nombre_rol", nullable = false, length = 100)
    private String nombreRol;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "nivel_jerarquia")
    private Integer nivelJerarquia;

    @Column(name = "requiere_tenant")
    private Boolean requiereTenant;

    @Type(JsonBinaryType.class)
    @Column(name = "permisos", columnDefinition = "jsonb")
    private Object permisos;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (activo == null) activo = true;
        if (requiereTenant == null) requiereTenant = true;
    }
}
