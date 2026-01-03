package com.kallpa.ssoma.assets.service;

import com.kallpa.ssoma.assets.domain.Activo;
import com.kallpa.ssoma.assets.dto.ActivoDTO;
import com.kallpa.ssoma.assets.dto.CreateActivoRequest;
import com.kallpa.ssoma.assets.dto.UpdateActivoRequest;
import com.kallpa.ssoma.assets.repository.ActivoRepository;
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
public class ActivoService {

    private final ActivoRepository activoRepository;

    @Transactional(readOnly = true)
    public List<ActivoDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todos los activos para tenant: {}", tenantId);
        return activoRepository.findByTenantId(tenantId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ActivoDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando activo {} para tenant: {}", id, tenantId);
        Activo activo = activoRepository.findByTenantIdAndActivoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Activo no encontrado con ID: " + id));
        return toDTO(activo);
    }

    @Transactional
    public ActivoDTO create(CreateActivoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nuevo activo {} para tenant: {}", request.getCodigo(), tenantId);

        // Validar código único
        if (activoRepository.existsByCodigo(request.getCodigo())) {
            throw new RuntimeException("Ya existe un activo con el código: " + request.getCodigo());
        }

        Activo activo = new Activo();
        activo.setTenantId(tenantId);
        activo.setEmpresaId(request.getEmpresaId());
        activo.setTipoActivo(request.getTipoActivo());
        activo.setCodigo(request.getCodigo());
        activo.setDescripcion(request.getDescripcion());
        activo.setMarca(request.getMarca());
        activo.setModelo(request.getModelo());
        activo.setPlaca(request.getPlaca());
        activo.setSerie(request.getSerie());
        activo.setCategoriaActivo(request.getCategoriaActivo());
        activo.setAnioFabricacion(request.getAnioFabricacion());
        activo.setKilometrajeActual(request.getKilometrajeActual());
        activo.setTieneRops(request.getTieneRops() != null ? request.getTieneRops() : false);
        activo.setTieneFops(request.getTieneFops() != null ? request.getTieneFops() : false);
        activo.setFechaUltimaCalibracion(request.getFechaUltimaCalibracion());
        activo.setTieneGuardasSeguridad(request.getTieneGuardasSeguridad() != null ? request.getTieneGuardasSeguridad() : false);
        activo.setSistemaProteccionFugas(request.getSistemaProteccionFugas() != null ? request.getSistemaProteccionFugas() : false);
        activo.setEstadoOperativo(request.getEstadoOperativo() != null ? request.getEstadoOperativo() : "OPERATIVO");
        activo.setMetadata(request.getMetadata());

        Activo savedActivo = activoRepository.save(activo);
        log.info("Activo creado exitosamente con ID: {}", savedActivo.getActivoId());
        return toDTO(savedActivo);
    }

    @Transactional
    public ActivoDTO update(UUID id, UpdateActivoRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando activo {} para tenant: {}", id, tenantId);

        Activo activo = activoRepository.findByTenantIdAndActivoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Activo no encontrado con ID: " + id));

        if (request.getEmpresaId() != null) {
            activo.setEmpresaId(request.getEmpresaId());
        }
        if (request.getTipoActivo() != null) {
            activo.setTipoActivo(request.getTipoActivo());
        }
        if (request.getDescripcion() != null) {
            activo.setDescripcion(request.getDescripcion());
        }
        if (request.getMarca() != null) {
            activo.setMarca(request.getMarca());
        }
        if (request.getModelo() != null) {
            activo.setModelo(request.getModelo());
        }
        if (request.getPlaca() != null) {
            activo.setPlaca(request.getPlaca());
        }
        if (request.getSerie() != null) {
            activo.setSerie(request.getSerie());
        }
        if (request.getCategoriaActivo() != null) {
            activo.setCategoriaActivo(request.getCategoriaActivo());
        }
        if (request.getAnioFabricacion() != null) {
            activo.setAnioFabricacion(request.getAnioFabricacion());
        }
        if (request.getKilometrajeActual() != null) {
            activo.setKilometrajeActual(request.getKilometrajeActual());
        }
        if (request.getTieneRops() != null) {
            activo.setTieneRops(request.getTieneRops());
        }
        if (request.getTieneFops() != null) {
            activo.setTieneFops(request.getTieneFops());
        }
        if (request.getFechaUltimaCalibracion() != null) {
            activo.setFechaUltimaCalibracion(request.getFechaUltimaCalibracion());
        }
        if (request.getTieneGuardasSeguridad() != null) {
            activo.setTieneGuardasSeguridad(request.getTieneGuardasSeguridad());
        }
        if (request.getSistemaProteccionFugas() != null) {
            activo.setSistemaProteccionFugas(request.getSistemaProteccionFugas());
        }
        if (request.getEstadoOperativo() != null) {
            activo.setEstadoOperativo(request.getEstadoOperativo());
        }
        if (request.getMetadata() != null) {
            activo.setMetadata(request.getMetadata());
        }

        Activo updatedActivo = activoRepository.save(activo);
        log.info("Activo actualizado exitosamente: {}", id);
        return toDTO(updatedActivo);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando activo {} para tenant: {}", id, tenantId);

        Activo activo = activoRepository.findByTenantIdAndActivoId(tenantId, id)
                .orElseThrow(() -> new RuntimeException("Activo no encontrado con ID: " + id));

        activoRepository.delete(activo);
        log.info("Activo eliminado exitosamente: {}", id);
    }

    @Transactional(readOnly = true)
    public List<ActivoDTO> search(String searchTerm) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando activos con término: {} para tenant: {}", searchTerm, tenantId);
        return activoRepository.searchActivos(tenantId, searchTerm).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivoDTO> findByEmpresaId(UUID empresaId) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando activos de la empresa {} para tenant: {}", empresaId, tenantId);
        return activoRepository.findByTenantIdAndEmpresaId(tenantId, empresaId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivoDTO> findByTipoActivo(String tipoActivo) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando activos de tipo {} para tenant: {}", tipoActivo, tenantId);
        return activoRepository.findByTenantIdAndTipoActivo(tenantId, tipoActivo).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ActivoDTO toDTO(Activo activo) {
        ActivoDTO dto = new ActivoDTO();
        dto.setId(activo.getActivoId());
        dto.setTenantId(activo.getTenantId());
        dto.setEmpresaId(activo.getEmpresaId());

        log.debug("Activo {} - empresaId: {}",
            activo.getActivoId(),
            activo.getEmpresaId());

        // TODO: En el futuro, hacer una llamada al identity-service para obtener el nombre de la empresa
        // Por ahora, dejamos empresaNombre como null
        dto.setEmpresaNombre(null);

        dto.setTipoActivo(activo.getTipoActivo());
        dto.setCodigo(activo.getCodigo());
        dto.setDescripcion(activo.getDescripcion());
        dto.setMarca(activo.getMarca());
        dto.setModelo(activo.getModelo());
        dto.setPlaca(activo.getPlaca());
        dto.setSerie(activo.getSerie());
        dto.setCategoriaActivo(activo.getCategoriaActivo());
        dto.setAnioFabricacion(activo.getAnioFabricacion());
        dto.setKilometrajeActual(activo.getKilometrajeActual());
        dto.setTieneRops(activo.getTieneRops());
        dto.setTieneFops(activo.getTieneFops());
        dto.setFechaUltimaCalibracion(activo.getFechaUltimaCalibracion());
        dto.setTieneGuardasSeguridad(activo.getTieneGuardasSeguridad());
        dto.setSistemaProteccionFugas(activo.getSistemaProteccionFugas());
        dto.setEstadoOperativo(activo.getEstadoOperativo());
        dto.setMetadata(activo.getMetadata());
        dto.setCreatedAt(activo.getCreatedAt());

        return dto;
    }
}
