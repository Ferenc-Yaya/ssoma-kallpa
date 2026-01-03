package com.kallpa.ssoma.documental.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "cat_documentos_requeribles")
public class DocumentoRequerible extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "doc_req_id", columnDefinition = "UUID")
    private UUID docReqId;

    @Column(name = "codigo_interno", nullable = false, unique = true, length = 50)
    private String codigoInterno;

    @Column(name = "nombre_mostrar", nullable = false, length = 100)
    private String nombreMostrar;

    @Column(name = "nombre", nullable = false, length = 255)
    private String nombre;

    @Column(name = "categoria", length = 100)
    private String categoria;

    @Column(name = "categoria_agrupacion", length = 50)
    private String categoriaAgrupacion;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
