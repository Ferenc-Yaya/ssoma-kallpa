package com.kallpa.ssoma.compliance.service;

import com.kallpa.ssoma.compliance.domain.EstadoCumplimiento;
import com.kallpa.ssoma.compliance.dto.CreateEstadoCumplimientoRequest;
import com.kallpa.ssoma.compliance.dto.EstadoCumplimientoDTO;
import com.kallpa.ssoma.compliance.dto.UpdateEstadoCumplimientoRequest;
import com.kallpa.ssoma.compliance.repository.EstadoCumplimientoRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EstadoCumplimientoService {

    private final EstadoCumplimientoRepository repository;

    @Transactional(readOnly = true)
    public List<EstadoCumplimientoDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todos los estados de cumplimiento para tenant: {}", tenantId);
        return repository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EstadoCumplimientoDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando estado de cumplimiento {} para tenant: {}", id, tenantId);
        EstadoCumplimiento estado = repository.findByTenantIdAndEstadoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Estado de cumplimiento no encontrado con ID: " + id));
        return toDTO(estado);
    }

    @Transactional(readOnly = true)
    public EstadoCumplimientoDTO findByEntidad(UUID entidadId, String tipoEntidad) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando estado de cumplimiento para entidad {} tipo {} en tenant: {}",
                entidadId, tipoEntidad, tenantId);
        return repository.findByTenantIdAndEntidadIdAndTipoEntidad(tenantId, entidadId, tipoEntidad)
                .map(this::toDTO)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<EstadoCumplimientoDTO> findByTipoEntidad(String tipoEntidad) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando estados de cumplimiento para tipo entidad {} en tenant: {}", tipoEntidad, tenantId);
        return repository.findByTenantIdAndTipoEntidad(tenantId, tipoEntidad).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EstadoCumplimientoDTO> findNoAptos() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando entidades no aptas para tenant: {}", tenantId);
        return repository.findNoAptos(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EstadoCumplimientoDTO> findConAlertas() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando entidades con alertas para tenant: {}", tenantId);
        return repository.findConAlertas(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EstadoCumplimientoDTO create(CreateEstadoCumplimientoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando estado de cumplimiento para entidad {} en tenant: {}",
                request.getEntidadId(), tenantId);

        EstadoCumplimiento estado = new EstadoCumplimiento();
        estado.setTenantId(tenantId);
        estado.setCumplimientoId(request.getCumplimientoId());
        estado.setEntidadId(request.getEntidadId());
        estado.setEntidadTipo(request.getEntidadTipo());
        estado.setTipoEntidad(request.getTipoEntidad());
        estado.setEsApto(request.getEsApto() != null ? request.getEsApto() : false);
        estado.setColorSemaforo(request.getColorSemaforo());
        estado.setDocumentosFaltantes(request.getDocumentosFaltantes() != null ? request.getDocumentosFaltantes() : 0);
        estado.setDocumentosVencidos(request.getDocumentosVencidos() != null ? request.getDocumentosVencidos() : 0);
        estado.setDocumentosVigentes(request.getDocumentosVigentes() != null ? request.getDocumentosVigentes() : 0);
        estado.setDetalleJson(request.getDetalleJson());
        estado.setUltimaActualizacion(LocalDateTime.now());

        estado = repository.save(estado);
        log.info("Estado de cumplimiento creado exitosamente con ID: {}", estado.getEstadoId());
        return toDTO(estado);
    }

    @Transactional
    public EstadoCumplimientoDTO update(UUID id, UpdateEstadoCumplimientoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando estado de cumplimiento {} para tenant: {}", id, tenantId);

        EstadoCumplimiento estado = repository.findByTenantIdAndEstadoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Estado de cumplimiento no encontrado con ID: " + id));

        if (request.getCumplimientoId() != null) {
            estado.setCumplimientoId(request.getCumplimientoId());
        }
        if (request.getEntidadId() != null) {
            estado.setEntidadId(request.getEntidadId());
        }
        if (request.getEntidadTipo() != null) {
            estado.setEntidadTipo(request.getEntidadTipo());
        }
        if (request.getTipoEntidad() != null) {
            estado.setTipoEntidad(request.getTipoEntidad());
        }
        if (request.getEsApto() != null) {
            estado.setEsApto(request.getEsApto());
        }
        if (request.getColorSemaforo() != null) {
            estado.setColorSemaforo(request.getColorSemaforo());
        }
        if (request.getDocumentosFaltantes() != null) {
            estado.setDocumentosFaltantes(request.getDocumentosFaltantes());
        }
        if (request.getDocumentosVencidos() != null) {
            estado.setDocumentosVencidos(request.getDocumentosVencidos());
        }
        if (request.getDocumentosVigentes() != null) {
            estado.setDocumentosVigentes(request.getDocumentosVigentes());
        }
        if (request.getDetalleJson() != null) {
            estado.setDetalleJson(request.getDetalleJson());
        }

        estado.setUltimaActualizacion(LocalDateTime.now());
        estado = repository.save(estado);
        log.info("Estado de cumplimiento actualizado exitosamente: {}", id);
        return toDTO(estado);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando estado de cumplimiento {} para tenant: {}", id, tenantId);

        EstadoCumplimiento estado = repository.findByTenantIdAndEstadoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Estado de cumplimiento no encontrado con ID: " + id));

        repository.delete(estado);
        log.info("Estado de cumplimiento eliminado exitosamente: {}", id);
    }

    private EstadoCumplimientoDTO toDTO(EstadoCumplimiento estado) {
        EstadoCumplimientoDTO dto = new EstadoCumplimientoDTO();
        dto.setEstadoId(estado.getEstadoId());
        dto.setCumplimientoId(estado.getCumplimientoId());
        dto.setTenantId(estado.getTenantId());
        dto.setEntidadId(estado.getEntidadId());
        dto.setEntidadTipo(estado.getEntidadTipo());
        dto.setTipoEntidad(estado.getTipoEntidad());
        dto.setEsApto(estado.getEsApto());
        dto.setColorSemaforo(estado.getColorSemaforo());
        dto.setDocumentosFaltantes(estado.getDocumentosFaltantes());
        dto.setDocumentosVencidos(estado.getDocumentosVencidos());
        dto.setDocumentosVigentes(estado.getDocumentosVigentes());
        dto.setDetalleJson(estado.getDetalleJson());
        dto.setUltimaActualizacion(estado.getUltimaActualizacion());
        dto.setCreatedAt(estado.getCreatedAt());
        return dto;
    }
}
