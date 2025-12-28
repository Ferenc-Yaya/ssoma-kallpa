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

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "categoria", length = 100)
    private String categoria; // 'EMPRESA', 'TRABAJADOR', 'VEHICULO', 'HERRAMIENTA'

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "obligatorio")
    private Boolean obligatorio = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (obligatorio == null) {
            obligatorio = true;
        }
    }
}
