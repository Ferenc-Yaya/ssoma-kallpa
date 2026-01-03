package com.kallpa.ssoma.compliance.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "tbl_estado_cumplimiento",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tenant_id", "entidad_id", "tipo_entidad"}))
@EqualsAndHashCode(callSuper = true)
public class EstadoCumplimiento extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "estado_id", columnDefinition = "UUID")
    private UUID estadoId;

    @Column(name = "cumplimiento_id", columnDefinition = "UUID")
    private UUID cumplimientoId;

    @Column(name = "entidad_id", nullable = false, columnDefinition = "UUID")
    private UUID entidadId;

    @Column(name = "entidad_tipo", nullable = false, length = 50)
    private String entidadTipo;

    @Column(name = "tipo_entidad", nullable = false, length = 20)
    private String tipoEntidad;

    @Column(name = "es_apto")
    private Boolean esApto = false;

    @Column(name = "color_semaforo", nullable = false, length = 20)
    private String colorSemaforo;

    @Column(name = "documentos_faltantes")
    private Integer documentosFaltantes = 0;

    @Column(name = "documentos_vencidos")
    private Integer documentosVencidos = 0;

    @Column(name = "documentos_vigentes")
    private Integer documentosVigentes = 0;

    @Column(name = "detalle_json", columnDefinition = "JSONB")
    private String detalleJson;

    @Column(name = "ultima_actualizacion")
    private LocalDateTime ultimaActualizacion;
}
