package com.kallpa.ssoma.hazmat.service;

import com.kallpa.ssoma.hazmat.domain.InventarioMatpel;
import com.kallpa.ssoma.hazmat.domain.SustanciaPeligrosa;
import com.kallpa.ssoma.hazmat.dto.CreateInventarioRequest;
import com.kallpa.ssoma.hazmat.dto.InventarioMatpelDTO;
import com.kallpa.ssoma.hazmat.dto.UpdateInventarioRequest;
import com.kallpa.ssoma.hazmat.repository.InventarioMatpelRepository;
import com.kallpa.ssoma.hazmat.repository.SustanciaPeligrosaRepository;
import com.kallpa.ssoma.shared.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventarioMatpelService {

    private final InventarioMatpelRepository inventarioRepository;
    private final SustanciaPeligrosaRepository sustanciaRepository;

    @Transactional(readOnly = true)
    public List<InventarioMatpelDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todo el inventario de materiales peligrosos para tenant: {}", tenantId);
        List<InventarioMatpel> inventarios = inventarioRepository.findByTenantId(tenantId);
        return inventarios.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InventarioMatpelDTO findById(Long id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando inventario con ID: {} para tenant: {}", id, tenantId);
        InventarioMatpel inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado con ID: " + id));

        if (!inventario.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a este inventario");
        }

        return toDTO(inventario);
    }

    @Transactional(readOnly = true)
    public List<InventarioMatpelDTO> findByEmpresaId(Long empresaId) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando inventario para empresa ID: {} y tenant: {}", empresaId, tenantId);
        List<InventarioMatpel> inventarios = inventarioRepository.findByTenantIdAndEmpresaId(tenantId, empresaId);
        return inventarios.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InventarioMatpelDTO create(CreateInventarioRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nuevo inventario de material peligroso para tenant: {}", tenantId);

        // Verificar que la sustancia existe
        SustanciaPeligrosa sustancia = sustanciaRepository.findById(request.getSustanciaId())
                .orElseThrow(() -> new RuntimeException("Sustancia peligrosa no encontrada con ID: " + request.getSustanciaId()));

        if (!sustancia.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a esta sustancia peligrosa");
        }

        InventarioMatpel inventario = InventarioMatpel.builder()
                .empresaId(request.getEmpresaId())
                .sustanciaId(request.getSustanciaId())
                .cantidad(request.getCantidad())
                .unidadMedida(request.getUnidadMedida())
                .ubicacion(request.getUbicacion())
                .fechaIngreso(request.getFechaIngreso())
                .lote(request.getLote())
                .estado(request.getEstado() != null ? request.getEstado() : "ALMACENADO")
                .build();

        inventario.setTenantId(tenantId);
        inventario = inventarioRepository.save(inventario);

        log.info("Inventario creado exitosamente con ID: {}", inventario.getInventarioId());
        return toDTO(inventario);
    }

    @Transactional
    public InventarioMatpelDTO update(Long id, UpdateInventarioRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando inventario con ID: {} para tenant: {}", id, tenantId);

        InventarioMatpel inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado con ID: " + id));

        if (!inventario.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a este inventario");
        }

        if (request.getCantidad() != null) {
            inventario.setCantidad(request.getCantidad());
        }
        if (request.getUnidadMedida() != null) {
            inventario.setUnidadMedida(request.getUnidadMedida());
        }
        if (request.getUbicacion() != null) {
            inventario.setUbicacion(request.getUbicacion());
        }
        if (request.getFechaIngreso() != null) {
            inventario.setFechaIngreso(request.getFechaIngreso());
        }
        if (request.getLote() != null) {
            inventario.setLote(request.getLote());
        }
        if (request.getEstado() != null) {
            inventario.setEstado(request.getEstado());
        }

        inventario = inventarioRepository.save(inventario);
        log.info("Inventario actualizado exitosamente con ID: {}", id);
        return toDTO(inventario);
    }

    @Transactional
    public void delete(Long id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando inventario con ID: {} para tenant: {}", id, tenantId);

        InventarioMatpel inventario = inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado con ID: " + id));

        if (!inventario.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a este inventario");
        }

        inventarioRepository.delete(inventario);
        log.info("Inventario eliminado exitosamente con ID: {}", id);
    }

    @Transactional(readOnly = true)
    public List<InventarioMatpelDTO> search(String searchTerm) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando inventarios con término: {} para tenant: {}", searchTerm, tenantId);
        List<InventarioMatpel> inventarios = inventarioRepository.searchByTenantId(tenantId, searchTerm);
        return inventarios.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventarioMatpelDTO> findByEstado(String estado) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando inventarios con estado: {} para tenant: {}", estado, tenantId);
        List<InventarioMatpel> inventarios = inventarioRepository.findByTenantIdAndEstado(tenantId, estado);
        return inventarios.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private InventarioMatpelDTO toDTO(InventarioMatpel inventario) {
        InventarioMatpelDTO dto = InventarioMatpelDTO.builder()
                .inventarioId(inventario.getInventarioId())
                .tenantId(inventario.getTenantId())
                .empresaId(inventario.getEmpresaId())
                .sustanciaId(inventario.getSustanciaId())
                .cantidad(inventario.getCantidad())
                .unidadMedida(inventario.getUnidadMedida())
                .ubicacion(inventario.getUbicacion())
                .fechaIngreso(inventario.getFechaIngreso())
                .lote(inventario.getLote())
                .estado(inventario.getEstado())
                .createdAt(inventario.getCreatedAt())
                .build();

        if (inventario.getSustancia() != null) {
            dto.setSustanciaNombre(inventario.getSustancia().getNombre());
            dto.setCodigoUn(inventario.getSustancia().getCodigoUn());
            dto.setClasePeligro(inventario.getSustancia().getClasePeligro());
        }

        return dto;
    }
}
