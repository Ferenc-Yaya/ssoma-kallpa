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
@Table(
        name = "tbl_usuarios",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"tenant_id", "username"}),
                @UniqueConstraint(columnNames = {"email"})
        }
)
public class Usuario extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "usuario_id")
    private UUID usuarioId;

    @Column(name = "tenant_id", nullable = false, length = 50)
    private String tenantId;

    @Column(name = "persona_id")
    private UUID personaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "persona_id", insertable = false, updatable = false)
    private Persona persona;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "nombre_completo", length = 100)
    private String nombreCompleto;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (activo == null) activo = true;
    }
}
