package com.kallpa.ssoma.identity.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tbl_personas")
public class Persona extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "persona_id", columnDefinition = "UUID")
    private java.util.UUID personaId;

    @Column(name = "empresa_id", columnDefinition = "UUID")
    private java.util.UUID empresaId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empresa_id", insertable = false, updatable = false)
    private Empresa empresa;

    @Column(name = "tipo_documento", length = 20)
    private String tipoDocumento = "DNI";

    @Column(name = "numero_documento", nullable = false, unique = true, length = 20)
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

    @Column(name = "cargo", length = 100)
    private String cargo;

    @Column(name = "estado", length = 50)
    private String estado = "ACTIVO";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (estado == null) {
            estado = "ACTIVO";
        }
        if (tipoDocumento == null) {
            tipoDocumento = "DNI";
        }
    }

    // Método helper para obtener nombre completo
    public String getNombreCompleto() {
        return nombres + " " + apellidos;
    }
}
