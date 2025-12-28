package com.kallpa.ssoma.hazmat.service;

import com.kallpa.ssoma.hazmat.domain.SustanciaPeligrosa;
import com.kallpa.ssoma.hazmat.dto.CreateSustanciaRequest;
import com.kallpa.ssoma.hazmat.dto.SustanciaPeligrosaDTO;
import com.kallpa.ssoma.hazmat.dto.UpdateSustanciaRequest;
import com.kallpa.ssoma.hazmat.repository.SustanciaPeligrosaRepository;
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
public class SustanciaPeligrosaService {

    private final SustanciaPeligrosaRepository sustanciaRepository;

    @Transactional(readOnly = true)
    public List<SustanciaPeligrosaDTO> findAll() {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando todas las sustancias peligrosas para tenant: {}", tenantId);
        List<SustanciaPeligrosa> sustancias = sustanciaRepository.findByTenantId(tenantId);
        return sustancias.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SustanciaPeligrosaDTO findById(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando sustancia peligrosa con ID: {} para tenant: {}", id, tenantId);
        SustanciaPeligrosa sustancia = sustanciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sustancia peligrosa no encontrada con ID: " + id));

        if (!sustancia.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a esta sustancia peligrosa");
        }

        return toDTO(sustancia);
    }

    @Transactional
    public SustanciaPeligrosaDTO create(CreateSustanciaRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creando nueva sustancia peligrosa: {} para tenant: {}", request.getNombre(), tenantId);

        SustanciaPeligrosa sustancia = SustanciaPeligrosa.builder()
                .nombre(request.getNombre())
                .codigoUn(request.getCodigoUn())
                .clasePeligro(request.getClasePeligro())
                .descripcion(request.getDescripcion())
                .hojaSeguridadUrl(request.getHojaSeguridadUrl())
                .build();

        sustancia.setTenantId(tenantId);
        sustancia = sustanciaRepository.save(sustancia);

        log.info("Sustancia peligrosa creada exitosamente con ID: {}", sustancia.getSustanciaId());
        return toDTO(sustancia);
    }

    @Transactional
    public SustanciaPeligrosaDTO update(UUID id, UpdateSustanciaRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Actualizando sustancia peligrosa con ID: {} para tenant: {}", id, tenantId);

        SustanciaPeligrosa sustancia = sustanciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sustancia peligrosa no encontrada con ID: " + id));

        if (!sustancia.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a esta sustancia peligrosa");
        }

        if (request.getNombre() != null) {
            sustancia.setNombre(request.getNombre());
        }
        if (request.getCodigoUn() != null) {
            sustancia.setCodigoUn(request.getCodigoUn());
        }
        if (request.getClasePeligro() != null) {
            sustancia.setClasePeligro(request.getClasePeligro());
        }
        if (request.getDescripcion() != null) {
            sustancia.setDescripcion(request.getDescripcion());
        }
        if (request.getHojaSeguridadUrl() != null) {
            sustancia.setHojaSeguridadUrl(request.getHojaSeguridadUrl());
        }

        sustancia = sustanciaRepository.save(sustancia);
        log.info("Sustancia peligrosa actualizada exitosamente con ID: {}", id);
        return toDTO(sustancia);
    }

    @Transactional
    public void delete(UUID id) {
        String tenantId = TenantContext.getTenantId();
        log.info("Eliminando sustancia peligrosa con ID: {} para tenant: {}", id, tenantId);

        SustanciaPeligrosa sustancia = sustanciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sustancia peligrosa no encontrada con ID: " + id));

        if (!sustancia.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Acceso denegado a esta sustancia peligrosa");
        }

        sustanciaRepository.delete(sustancia);
        log.info("Sustancia peligrosa eliminada exitosamente con ID: {}", id);
    }

    @Transactional(readOnly = true)
    public List<SustanciaPeligrosaDTO> search(String searchTerm) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando sustancias peligrosas con término: {} para tenant: {}", searchTerm, tenantId);
        List<SustanciaPeligrosa> sustancias = sustanciaRepository.searchByTenantId(tenantId, searchTerm);
        return sustancias.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SustanciaPeligrosaDTO> findByClasePeligro(String clasePeligro) {
        String tenantId = TenantContext.getTenantId();
        log.debug("Buscando sustancias por clase de peligro: {} para tenant: {}", clasePeligro, tenantId);
        List<SustanciaPeligrosa> sustancias = sustanciaRepository.findByTenantIdAndClasePeligro(tenantId, clasePeligro);
        return sustancias.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private SustanciaPeligrosaDTO toDTO(SustanciaPeligrosa sustancia) {
        return SustanciaPeligrosaDTO.builder()
                .sustanciaId(sustancia.getSustanciaId())
                .tenantId(sustancia.getTenantId())
                .nombre(sustancia.getNombre())
                .codigoUn(sustancia.getCodigoUn())
                .clasePeligro(sustancia.getClasePeligro())
                .descripcion(sustancia.getDescripcion())
                .hojaSeguridadUrl(sustancia.getHojaSeguridadUrl())
                .createdAt(sustancia.getCreatedAt())
                .build();
    }
}
