package com.kallpa.ssoma.compliance.domain;

import com.kallpa.ssoma.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@Entity
@Table(name = "tbl_reglas_negocio")
@EqualsAndHashCode(callSuper = true)
public class ReglaNegocio extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "regla_id", columnDefinition = "UUID")
    private UUID reglaId;

    @Column(name = "aplicar_a_tipo_empresa", columnDefinition = "UUID")
    private UUID aplicarATipoEmpresa;

    @Column(name = "aplicar_a_rol_o_tipo", length = 100)
    private String aplicarARolOTipo;

    @Column(name = "entidad_objetivo", nullable = false, length = 20)
    private String entidadObjetivo;

    @Column(name = "doc_req_id", columnDefinition = "UUID")
    private UUID docReqId;

    @Column(name = "nombre_regla", nullable = false, length = 255)
    private String nombreRegla;

    @Column(name = "categoria", length = 100)
    private String categoria;

    @Column(name = "condicion", nullable = false, columnDefinition = "TEXT")
    private String condicion;

    @Column(name = "dias_vigencia_minima")
    private Integer diasVigenciaMinima = 0;

    @Column(name = "es_bloqueante")
    private Boolean esBloqueante = true;

    @Column(name = "color_semaforo", nullable = false, length = 20)
    private String colorSemaforo;

    @Column(name = "mensaje_alerta", columnDefinition = "TEXT")
    private String mensajeAlerta;

    @Column(name = "activa")
    private Boolean activa = true;

    @Column(name = "activo")
    private Boolean activo = true;
}