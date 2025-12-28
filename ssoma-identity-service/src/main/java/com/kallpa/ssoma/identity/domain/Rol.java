package com.kallpa.ssoma.identity.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;

import java.util.UUID;

@Data
@Entity
@Table(name = "tbl_roles")
@EqualsAndHashCode(callSuper = true)
public class Rol extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "rol_id", columnDefinition = "UUID")
    private UUID rolId;

    @Column(name = "codigo", unique = true)
    private String codigo;

    @Column(name = "nombre_rol", nullable = false)
    private String nombreRol;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "nivel_jerarquia")
    private Integer nivelJerarquia;

    @Column(name = "requiere_tenant")
    private Boolean requiereTenant = true;

    @Column(name = "activo")
    private Boolean activo = true;

    @Type(JsonBinaryType.class)
    @Column(name = "permisos", columnDefinition = "jsonb")
    private String permisos;
}