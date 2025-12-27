package com.kallpa.ssoma.documental.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tbl_documentos")
public class Documento extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "documento_id")
    private Long documentoId;

    @Column(name = "entidad_tipo", nullable = false, length = 50)
    private String entidadTipo; // 'EMPRESA', 'PERSONA', 'ACTIVO', 'CONTRATO'

    @Column(name = "entidad_id", nullable = false)
    private Long entidadId;

    @Column(name = "documento_requerible_id")
    private Long documentoRequeribleId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "documento_requerible_id", insertable = false, updatable = false)
    private DocumentoRequerible documentoRequerible;

    @Column(name = "nombre_archivo", nullable = false)
    private String nombreArchivo;

    @Column(name = "ruta_archivo", nullable = false, length = 500)
    private String rutaArchivo;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "estado", length = 50)
    private String estado = "VIGENTE"; // 'VIGENTE', 'VENCIDO', 'POR_VENCER'

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (estado == null) {
            estado = "VIGENTE";
        }
    }
}
