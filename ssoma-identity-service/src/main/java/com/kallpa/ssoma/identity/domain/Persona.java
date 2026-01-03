package com.kallpa.ssoma.identity.domain;

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
@Table(
        name = "tbl_personas",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tenant_id", "numero_documento"})
)
public class Persona extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "persona_id")
    private UUID personaId;

    @Column(name = "tenant_id", nullable = false, length = 50)
    private String tenantId;

    @Column(name = "empresa_id")
    private UUID empresaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", insertable = false, updatable = false)
    private Empresa empresa;

    @Column(name = "contrato_activo_id")
    private UUID contratoActivoId;

    @Column(name = "tipo_documento", length = 20)
    private String tipoDocumento;

    @Column(name = "numero_documento", nullable = false, length = 20)
    private String numeroDocumento;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "cargo", nullable = false, length = 100)
    private String cargo;

    @Column(name = "es_conductor")
    private Boolean esConductor;

    @Column(name = "grupo_sanguineo", length = 10)
    private String grupoSanguineo;

    @Column(name = "foto_perfil_url", columnDefinition = "TEXT")
    private String fotoPerfilUrl;

    @Column(name = "estado_global", length = 20)
    private String estadoGlobal;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (estadoGlobal == null) estadoGlobal = "ACTIVO";
        if (esConductor == null) esConductor = false;
        if (tipoDocumento == null) tipoDocumento = "DNI";
    }

    public String getNombreCompleto() {
        return nombres + " " + apellidos;
    }
}
