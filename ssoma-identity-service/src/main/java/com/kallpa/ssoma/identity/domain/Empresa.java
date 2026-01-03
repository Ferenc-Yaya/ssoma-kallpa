package com.kallpa.ssoma.identity.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tbl_empresas",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tenant_id", "ruc"}))
public class Empresa extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "empresa_id")
    private UUID empresaId;

    @Column(name = "tenant_id", nullable = false, length = 50)
    private String tenantId;

    @Column(name = "ruc", nullable = false, length = 11)
    private String ruc;

    @Column(name = "razon_social", nullable = false, length = 200)
    private String razonSocial;

    @Column(name = "tipo_id", columnDefinition = "UUID")
    private UUID tipoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_id", insertable = false, updatable = false)
    private TipoContratista tipoContratista;

    @Column(name = "direccion", columnDefinition = "TEXT")
    private String direccion;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

    @Column(name = "sitio_web", length = 100)
    private String sitioWeb;

    @Column(name = "rubro_comercial", length = 100)
    private String rubroComercial;

    @Column(name = "score_seguridad")
    private Integer scoreSeguridad = 100;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<EmpresaContacto> contactos = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public void addContacto(EmpresaContacto contacto) {
        contactos.add(contacto);
        contacto.setEmpresa(this);
    }

    public void removeContacto(EmpresaContacto contacto) {
        contactos.remove(contacto);
        contacto.setEmpresa(null);
    }
}
