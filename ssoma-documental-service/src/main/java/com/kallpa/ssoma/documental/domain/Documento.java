package com.kallpa.ssoma.documental.domain;

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
@Table(name = "tbl_documentos")
public class Documento extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "documento_id", columnDefinition = "UUID")
    private UUID documentoId;

    @Column(name = "entidad_tipo", nullable = false, length = 50)
    private String entidadTipo; // 'EMPRESA', 'PERSONA', 'ACTIVO', 'CONTRATO'

    @Column(name = "entidad_id", nullable = false, columnDefinition = "UUID")
    private UUID entidadId;

    @Column(name = "doc_req_id", columnDefinition = "UUID")
    private UUID docReqId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doc_req_id", insertable = false, updatable = false)
    private DocumentoRequerible documentoRequerible;

    @Column(name = "nombre_archivo", nullable = false, length = 255)
    private String nombreArchivo;

    @Column(name = "numero_documento", length = 100)
    private String numeroDocumento;

    @Column(name = "ruta_archivo", nullable = false, length = 500)
    private String rutaArchivo;

    @Column(name = "archivo_url", nullable = false, columnDefinition = "TEXT")
    private String archivoUrl;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "estado", length = 50)
    private String estado = "VIGENTE";

    @Column(name = "estado_validacion", length = 20)
    private String estadoValidacion = "PENDIENTE";

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
        if (estadoValidacion == null) {
            estadoValidacion = "PENDIENTE";
        }
    }
}
