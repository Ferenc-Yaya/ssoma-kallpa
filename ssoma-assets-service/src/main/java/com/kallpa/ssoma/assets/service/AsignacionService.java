package com.kallpa.ssoma.assets.service;

import com.kallpa.ssoma.assets.domain.Asignacion;
import com.kallpa.ssoma.assets.dto.AsignacionDTO;
import com.kallpa.ssoma.assets.dto.CreateAsignacionRequest;
import com.kallpa.ssoma.assets.dto.UpdateAsignacionRequest;
import com.kallpa.ssoma.assets.repository.AsignacionRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsignacionService {

    private final AsignacionRepository asignacionRepository;

    @Transactional(readOnly = true)
    public List<AsignacionDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todas las asignaciones para tenant: {}", tenantId);
        return asignacionRepository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AsignacionDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando asignacion {} para tenant: {}", id, tenantId);
        Asignacion asignacion = asignacionRepository.findByTenantIdAndAsignacionId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));
        return toDTO(asignacion);
    }

    @Transactional
    public AsignacionDTO create(CreateAsignacionRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nueva asignación para activo {} en tenant: {}", request.getActivoId(), tenantId);

        Asignacion asignacion = new Asignacion();
        asignacion.setTenantId(tenantId);
        asignacion.setActivoId(request.getActivoId());
        asignacion.setPersonaId(request.getPersonaId());
        asignacion.setFechaAsignacion(request.getFechaAsignacion());
        asignacion.setFechaDevolucion(request.getFechaDevolucion());
        asignacion.setEstado(request.getEstado() != null ? request.getEstado() : "VIGENTE");
        asignacion.setObservaciones(request.getObservaciones());

        Asignacion savedAsignacion = asignacionRepository.save(asignacion);
        log.info("Asignación creada exitosamente con ID: {}", savedAsignacion.getAsignacionId());
        return toDTO(savedAsignacion);
    }

    @Transactional
    public AsignacionDTO update(UUID id, UpdateAsignacionRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando asignación {} para tenant: {}", id, tenantId);

        Asignacion asignacion = asignacionRepository.findByTenantIdAndAsignacionId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));

        if (request.getPersonaId() != null) {
            asignacion.setPersonaId(request.getPersonaId());
        }
        if (request.getFechaAsignacion() != null) {
            asignacion.setFechaAsignacion(request.getFechaAsignacion());
        }
        if (request.getFechaDevolucion() != null) {
            asignacion.setFechaDevolucion(request.getFechaDevolucion());
        }
        if (request.getFechaFin() != null) {
            asignacion.setFechaFin(request.getFechaFin());
        }
        if (request.getEstado() != null) {
            asignacion.setEstado(request.getEstado());
        }
        if (request.getObservaciones() != null) {
            asignacion.setObservaciones(request.getObservaciones());
        }

        Asignacion updatedAsignacion = asignacionRepository.save(asignacion);
        log.info("Asignación actualizada exitosamente: {}", id);
        return toDTO(updatedAsignacion);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando asignación {} para tenant: {}", id, tenantId);

        Asignacion asignacion = asignacionRepository.findByTenantIdAndAsignacionId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));

        asignacionRepository.delete(asignacion);
        log.info("Asignación eliminada exitosamente: {}", id);
    }

    @Transactional(readOnly = true)
    public List<AsignacionDTO> findByActivoId(UUID activoId) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando asignaciones del activo {} para tenant: {}", activoId, tenantId);
        return asignacionRepository.findByTenantIdAndActivoId(tenantId, activoId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AsignacionDTO> findByPersonaId(UUID personaId) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando asignaciones de la persona {} para tenant: {}", personaId, tenantId);
        return asignacionRepository.findByTenantIdAndPersonaId(tenantId, personaId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AsignacionDTO toDTO(Asignacion asignacion) {
        AsignacionDTO dto = new AsignacionDTO();
        dto.setId(asignacion.getAsignacionId());
        dto.setTenantId(asignacion.getTenantId());
        dto.setActivoId(asignacion.getActivoId());

        if (asignacion.getActivo() != null) {
            dto.setActivoCodigo(asignacion.getActivo().getCodigo());
            dto.setActivoDescripcion(asignacion.getActivo().getDescripcion());
        }

        dto.setPersonaId(asignacion.getPersonaId());
        dto.setFechaAsignacion(asignacion.getFechaAsignacion());
        dto.setFechaDevolucion(asignacion.getFechaDevolucion());
        dto.setFechaInicio(asignacion.getFechaInicio());
        dto.setFechaFin(asignacion.getFechaFin());
        dto.setEstado(asignacion.getEstado());
        dto.setObservaciones(asignacion.getObservaciones());
        dto.setCreatedAt(asignacion.getCreatedAt());

        return dto;
    }
}
