package com.kallpa.ssoma.assets.domain;

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
@Table(name = "tbl_activos")
public class Activo extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "activo_id", columnDefinition = "UUID")
    private UUID activoId;

    @Column(name = "empresa_id", nullable = false, columnDefinition = "UUID")
    private UUID empresaId;

    @Column(name = "tipo_activo", nullable = false, length = 50)
    private String tipoActivo; // 'VEHICULO', 'HERRAMIENTA'

    @Column(name = "codigo", nullable = false, unique = true, length = 100)
    private String codigo;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "marca", length = 100)
    private String marca;

    @Column(name = "modelo", length = 100)
    private String modelo;

    @Column(name = "placa", length = 20)
    private String placa; // Solo para vehículos

    @Column(name = "serie", length = 100)
    private String serie;

    @Column(name = "categoria_activo", nullable = false, length = 50)
    private String categoriaActivo;

    @Column(name = "anio_fabricacion")
    private Integer anioFabricacion;

    @Column(name = "kilometraje_actual")
    private Integer kilometrajeActual;

    @Column(name = "tiene_rops")
    private Boolean tieneRops = false;

    @Column(name = "tiene_fops")
    private Boolean tieneFops = false;

    @Column(name = "fecha_ultima_calibracion")
    private LocalDate fechaUltimaCalibracion;

    @Column(name = "tiene_guardas_seguridad")
    private Boolean tieneGuardasSeguridad = false;

    @Column(name = "sistema_proteccion_fugas")
    private Boolean sistemaProteccionFugas = false;

    @Column(name = "estado_operativo", length = 20)
    private String estadoOperativo = "OPERATIVO";

    @Column(name = "metadata", columnDefinition = "jsonb")
    private String metadata;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (estadoOperativo == null) {
            estadoOperativo = "OPERATIVO";
        }
        if (tieneRops == null) {
            tieneRops = false;
        }
        if (tieneFops == null) {
            tieneFops = false;
        }
        if (tieneGuardasSeguridad == null) {
            tieneGuardasSeguridad = false;
        }
        if (sistemaProteccionFugas == null) {
            sistemaProteccionFugas = false;
        }
    }
}
